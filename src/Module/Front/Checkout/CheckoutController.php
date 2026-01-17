<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Checkout;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Cart\CartService;
use Lyrasoft\Melo\Cart\CartStorage;
use Lyrasoft\Melo\Data\AddressInfo;
use Lyrasoft\Melo\Data\CartData;
use Lyrasoft\Melo\Data\CheckoutParams;
use Lyrasoft\Melo\Data\InvoiceData;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Enum\InvoiceType;
use Lyrasoft\Melo\Features\LessonCheckoutService;
use Lyrasoft\Melo\Features\Payment\PaymentComposer;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Manager\Logger;
use Windwalker\Core\Router\Navigator;
use Windwalker\DI\Attributes\Service;
use Windwalker\Http\HttpClient;
use Windwalker\ORM\ORM;

use function Windwalker\ds;

#[Controller]
class CheckoutController
{
    public function checkout(
        AppContext $app,
        ORM $orm,
        Navigator $nav,
        UserService $userService,
        #[Service]
        CartService $cartService,
        #[Service]
        LessonCheckoutService $checkoutService,
        #[Service]
        CartStorage $cartStorage,
    ) {
        $input = (array) $app->input('checkout');

        $app->state->remember('checkout.data', $input);

        /** @var User $user */
        $user = $userService->getUser();

        if (!$user->isLogin()) {
            return $nav->to('melo_cart');
        }

        /**
         * @var MeloOrder $order
         * @var CartData $cartData
         */
        [$order, $cartData] = (array) $orm->getDb()->transaction(
            function () use ($input, $cartService, $user, $checkoutService) {
                $order = new MeloOrder();

                $invoice = new InvoiceData(
                    name: $input['invoice_name'] ?? '',
                    title: $input['invoice_title'] ?? '',
                    vat: $input['invoice_vat'] ?? '',
                    address: new AddressInfo(
                        city: $input['address']['city'] ?? '',
                        dist: $input['address']['dist'] ?? '',
                        zip: $input['address']['zip'] ?? '',
                        address: $input['address']['address'] ?? '',
                    )
                );

                $order->invoiceData = $invoice;
                $order->invoiceType = $invoice->vat ? InvoiceType::COMPANY : InvoiceType::IDV;
                $order->userId = $user->id;
                $order->payment = $input['payment'];
                $order->createdBy = $user->id;

                $cartData = $cartService->getData();

                return [
                    $checkoutService->createOrder($order, $cartData, $input),
                    $cartData,
                ];
            }
        );

        $checkoutService->notifyForCheckout($order, $cartData, $user);

        $orderUri = $app->getNav()->to('melo_order_item')->var('no', $order->no);

        $checkoutParams = new CheckoutParams(
            order: $order,
            user: $user,
            cartData: $cartData
        );

        try {
            $result = $checkoutService->processPayment($checkoutParams);

            return $result ?: $orderUri;
        } catch (\Exception $e) {
            $app->addMessage($e->getMessage(), 'warning');
            Logger::error('melo/checkout-error', $e->getMessage(), ['exception' => $e]);

            return $orderUri;
        }
    }

    public function paymentTask(
        AppContext $app,
        ORM $orm,
        PaymentComposer $paymentComposer
    ) {
        $id = $app->input('id');
        $task = $app->input('task');

        Logger::info('melo/payment-task', $uri = $app->getSystemUri()->full());
        Logger::info('melo/payment-task', print_r($app->input()->dump(), true));

        try {
            $order = $orm->findOne(MeloOrder::class, $id);

            if (!$order) {
                throw new \RuntimeException('Order not found.');
            }

            $gateway = $paymentComposer->getGateway($order->payment);

            if (!$gateway) {
                throw new \RuntimeException('Gateway not found.');
            }

            $http = new HttpClient();
            Logger::info(
                'melo/payment-task',
                $http->toCurlCmd('POST', $uri, HttpClient::formData($app->input()->dump()))
            );

            return $gateway->runTask($app, $order, $task);
        } catch (\Throwable $e) {
            Logger::info('melo/payment-error', $e);

            return $e->getMessage();
        }
    }
}
