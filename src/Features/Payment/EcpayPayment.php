<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Payment;

use Ecpay\Sdk\Factories\Factory;
use Ecpay\Sdk\Response\VerifiedArrayResponse;
use Ecpay\Sdk\Services\CheckMacValueService;
use Ecpay\Sdk\Services\UrlService;
use Lyrasoft\Melo\Data\CartItem;
use Lyrasoft\Melo\Data\CheckoutParams;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Enum\EcpayPaymentType;
use Lyrasoft\Melo\Enum\OrderHistoryType;
use Lyrasoft\Melo\Enum\OrderState;
use Lyrasoft\Melo\Features\OrderService;
use Psr\Http\Message\UriInterface;
use Unicorn\View\ORMAwareViewModelTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Manager\Logger;
use Windwalker\Core\Renderer\RendererService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\Core\Router\SystemUri;
use Windwalker\ORM\ORM;
use Windwalker\Utilities\Contract\LanguageInterface;
use Windwalker\Utilities\Str;

use function Windwalker\chronos;

class EcpayPayment implements MeloPaymentInterface
{
    use PaymentTrait;
    use ORMAwareViewModelTrait;

    public function __construct(
        protected ApplicationInterface $app,
        public EcpayPaymentType $type,
        string $title = '',
        public bool $testMode = false,
    ) {
        $this->title = $title;
    }

    public function getTitle(LanguageInterface $lang): string
    {
        return $this->title ?: $this->type->getTitle($lang);
    }

    public static function getId(): string
    {
        return 'ecpay';
    }

    public static function getTypeTitle(LanguageInterface $lang): string
    {
        return '綠界支付';
    }

    public static function getDescription(LanguageInterface $lang): string
    {
        return '綠界金流 All-in-one 支付';
    }

    public function process(CheckoutParams $params): mixed
    {
        /** @var MeloOrder $order */
        $order = $params->order;

        $nav = $this->app->service(Navigator::class);
        $chronos = $this->app->service(ChronosService::class);

        $notify = $nav->to('melo_payment_task')->id($order->id)
            ->full();
        
        $desc = array_map(
            static function (CartItem $item) {
                return $item->lesson->title;
            },
            $params->cartData->items
        );

        $input = [
            'MerchantID' => $this->getMerchantID(),
            'MerchantTradeNo' => $order->paymentNo,
            'MerchantTradeDate' => $chronos->toLocalFormat('now', 'Y/m/d H:i:s'),
            'PaymentType' => 'aio',
            'TotalAmount' => (int) $order->total,
            'TradeDesc' => UrlService::ecpayUrlEncode('Lesson Checkout'),
            'ItemName' => implode("#", $desc),
            'ReturnURL' => $this->replaceWebhookUrl($notify->task('receivePaid')),
            'ClientBackURL' => (string) $notify->task('returnBack'),
            'ChoosePayment' => $this->type->value,
            'EncryptType' => 1,

            'ExpireDate' => 7,
            'PaymentInfoURL' => $this->replaceWebhookUrl($notify->task('paymentInfo')),
        ];

        if ($this->type === EcpayPaymentType::CREDIT) {
            $order->expiredOn = chronos('+10minutes');
        } else {
            $order->expiredOn = chronos('+7days');
        }

        $order->paymentData->input = $input;

        $this->orm->updateOne($order);

        $factory = $this->getEcpayFactory();

        return $factory->create('AutoSubmitFormWithCmvService')->generate(
            $input,
            $this->getEndpoint('Cashier/AioCheckOut/V5')
        );
    }

    protected function replaceWebhookUrl(UriInterface|string $uri): string
    {
        $url = (string) $uri;
        $systemUri = $this->app->retrieve(SystemUri::class);

        if ($tunnel = env('ECPAY_WEBHOOK_URL')) {
            $url = Str::ensureRight($tunnel, '/') . Str::removeLeft($url, $systemUri->root());
        }

        return $url;
    }

    public function runTask(AppContext $app, MeloOrder $order, string $task): mixed
    {
        return match ($task) {
            'receivePaid' => $app->call($this->receivePaid(...)),
            'returnBack' => $app->call($this->returnBack(...)),
            'paymentInfo' => $app->call($this->paymentInfo(...)),
        };
    }

    protected function receivePaid(AppContext $app, ORM $orm, OrderService $orderService): string
    {
        $factory = $this->getEcpayFactory();
        /** @var VerifiedArrayResponse $checkoutResponse */
        $checkoutResponse = $factory->create(VerifiedArrayResponse::class);

        $id = (string) $app->input('id');

        try {
            $res = $checkoutResponse->get($_POST);
        } catch (\Exception $e) {
            Logger::error('melo/ecpay-payment-error', 'ID: ' . $id);
            Logger::error('melo/ecpay-payment-error', $e->getMessage());

            return '0|' . $e->getMessage();
        }

        $order = $orm->findOne(MeloOrder::class, $id);

        if (!$order) {
            Logger::error('melo/ecpay-payment-error', 'ID: ' . $id);
            Logger::error('melo/ecpay-payment-error', 'Order not found');

            return '0|No order';
        }

        $order->params['payment_notify_error'] = null;

        try {
            if ((string) $res['RtnCode'] === '1') {
                if (!$order->paidAt) {
                    $order->paidAt = 'now';
                }

                $orderService->changeState(
                    $order,
                    OrderState::PAID,
                    OrderHistoryType::SYSTEM,
                    '付款成功',
                    true,
                );
            } else {
                $orderService->changeState(
                    $order,
                    OrderState::FAILED,
                    OrderHistoryType::SYSTEM,
                    $res['RtnMsg'] ?? '付款失敗',
                    false
                );
            }
        } catch (\Throwable $e) {
            $params['payment_notify_error'] = $e->getMessage();

            $orm->updateBatch(
                MeloOrder::class,
                compact('params'),
                ['id' => $order->id]
            );

            Logger::error('melo/ecpay-payment-error', "ID: $id");
            Logger::error('melo/ecpay-payment-error', $e->getMessage());

            return '0|' . $e->getMessage();
        }

        return '1|OK';
    }

    public function returnBack(AppContext $app, Navigator $nav): RouteUri
    {
        $id = (string) $app->input('id');
        $order = $this->orm->mustFindOne(MeloOrder::class, $id);

        // $app->state->forget('checkout.data');

        return $nav->to('melo_order_item')
            ->var('no', $order->no);
    }

    public function paymentInfo(AppContext $app): string
    {
        $orm = $app->service(ORM::class);

        $id = (string) $app->input('id');

        $order = $orm->mustFindOne(MeloOrder::class, $id);

        $order->paymentData->info = $app->input()->dump();

        $orm->updateOne($order);

        return '1|OK';
    }

    public function orderInfo(MeloOrder $order, iterable $items): string
    {
        $payment = $this;

        return $this->app->retrieve(RendererService::class)->render(
            'melo.ecpay.ecpay-order-info',
            compact('order', 'items', 'payment')
        );
    }

    public function getEndpoint(string $path): string
    {
        $stage = $this->isTest() ? '-stage' : '';

        return "https://payment{$stage}.ecpay.com.tw/" . $path;
    }

    public function isTest(): bool
    {
        return $this->getMerchantID() === '2000132';
    }

    public function getMerchantID(): string
    {
        return $this->getEnvCredentials()[0];
    }

    public function getHashKey(): string
    {
        return $this->getEnvCredentials()[1];
    }

    public function getHashIV(): string
    {
        return $this->getEnvCredentials()[2];
    }

    public function getEcpayFactory(string $hashMethod = CheckMacValueService::METHOD_SHA256): Factory
    {
        return new Factory(
            [
                'hashKey' => $this->getHashKey(),
                'hashIv' => $this->getHashIV(),
                'hashMethod' => $hashMethod,
            ]
        );
    }

    /**
     * @return  string[]
     */
    protected function getEnvCredentials(): array
    {
        return [
            env("MELO_ECPAY_MERCHANT_ID", '2000132'),
            env("MELO_ECPAY_HASH_KEY", '5294y06JbISpM5x9'),
            env("MELO_ECPAY_HASH_IV", 'v77hoKGq4kWxNNIS'),
        ];
    }
}
