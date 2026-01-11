<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\Entity\UserRoleMap;
use Lyrasoft\Melo\Cart\Price\PriceObject;
use Lyrasoft\Melo\Cart\Price\PriceSet;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Entity\MeloOrderTotal;
use Lyrasoft\Melo\Enum\OrderHistoryType;
use Lyrasoft\Melo\Enum\OrderState;
use Lyrasoft\Melo\MeloPackage;
use Random\RandomException;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Form\Exception\ValidateFailException;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\Mailer\MailerInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;
use Windwalker\Query\Query;

use function Windwalker\collect;

#[Service]
class CheckoutService
{
    use TranslatorTrait;

    public function __construct(
        protected ORM $orm,
        #[Service]
        protected OrderService $orderService,
        #[Autowire]
        protected MeloPackage $melo,
        protected MailerInterface $mailer,
        protected ApplicationInterface $app,
    ) {
    }

    /**
     * @throws RandomException
     */
    public function createOrder(
        MeloOrder $orderData,
        array $cartData,
        array $input
    ): MeloOrder {
        $totals = (float) $cartData['totals']->get('lesson_total')->__toString();
        $grandTotal = (float) $cartData['totals']->get('grand_total')->__toString();

        if ($grandTotal < 0) {
            throw new ValidateFailException('Cannot process checkout for negative price.');
        }

        $orderData->total = $grandTotal;
        $orderData->state = OrderState::PENDING;
        $orderData->expiredOn = $this->melo->config('checkout.default_expiry') ?? '+7days';

        $order = $this->orm->createOne(MeloOrder::class, $orderData);

        $order = $this->prepareOrderAndPaymentNo($order);

        $orderItems = $this->createOrderItems($order, $cartData);
        $orderTotals = $this->createOrderTotals($order, $cartData['totals']);

        $this->orderService->createHistory(
            $order,
            OrderState::PENDING,
            OrderHistoryType::SYSTEM,
            '建立訂單',
            true,
        );

        if (
            $order->state === OrderState::PAID
            || $order->state === OrderState::FREE
        ) {
            $this->orderService->assignLessonToUser($order->id);
        }

        return $order;
    }

    public function createOrderItems(MeloOrder $order, array $cartData): \Windwalker\Data\Collection
    {
        $cartItems = $cartData['items'] ?? [];

        $orderItems = collect();

        foreach ($cartItems as $item) {
            $orderItem = new MeloOrderItem();

            $orderItem->orderId = $order->id;
            $orderItem->lessonId = (int) $item['id'];
            $orderItem->title = $item['title'];
            $orderItem->image = $item['image'];
            $orderItem->lessonData = $item;
            $orderItem->price = (float) $item['prices']->get('final')->__toString();
            $orderItem->total = (float) $item['prices']->get('final')->__toString();
            $orderItem->priceSet = (array) $item['prices'];

            $orderItem = $this->orm->createOne($orderItem);

            $orderItems[] = $orderItem;
        }

        return $orderItems;
    }

    public function createOrderTotals(MeloOrder $order, PriceSet $totals): \Windwalker\Data\Collection
    {
        $i = 1;

        $orderTotals = collect();

        /** @var PriceObject $total */
        foreach ($totals as $total) {
            $orderTotal = new MeloOrderTotal();
            $orderTotal->orderId = $order->id;
            $orderTotal->type = str_starts_with($total->getName(), 'discount')
                    ? 'discount'
                    : 'total';
            $orderTotal->code = $total->getName();
            $orderTotal->title = $total->getLabel();
            $orderTotal->value = $total->getPrice()->toFloat();
            $orderTotal->params = $total->getParams();
            $orderTotal->discountId = $total->getParams()['discount_id'] ?? 0;
            $orderTotal->discountType = $total->getParams()['discount_type'] ?? '';
            $orderTotal->ordering = $i;
            $orderTotal->protect = $orderTotal->type === 'total';

            $this->orm->createOne(MeloOrderTotal::class, $orderTotal);

            $orderTotals[] = $orderTotal;

            $i++;
        }

        return $orderTotals;
    }

    /**
     * @throws RandomException
     */
    protected function prepareOrderAndPaymentNo(MeloOrder $order, bool $test = false): MeloOrder
    {
        $no = $this->orderService->createOrderNo($order->id);
        $tradeNo = $this->orderService->getPaymentNo($no, $test);

        // Save NO
        $this->orm->updateWhere(
            MeloOrder::class,
            ['no' => $no, 'payment_no' => $tradeNo],
            ['id' => $order->id]
        );

        $order->no = $no;
        $order->paymentNo = $tradeNo;

        return $order;
    }

    public function notifyForCheckout(MeloOrder $order, array $cartData, User $user): MeloOrder
    {
        $userMail = $user->email;

        if ($userMail) {
            $this->notifyBuyer($order, $cartData, $user);
        }

        // Notify admins
        $this->notifyAdmins($order, $cartData, $user);

        return $order;
    }


    protected function notifyBuyer(MeloOrder $order, array $cartData, User $user): void
    {
        $isAdmin = false;

        $this->mailer->createMessage(
            $this->trans(
                'melo.mail.new.order.subject.for.buyer',
                no: $order->no,
                sitename: $this->melo->config('shop.sitename'),
            )
        )
            ->to($user->email)
            ->renderBody(
                'mail.new-order',
                compact('order', 'cartData', 'isAdmin')
            )
            ->send();
    }

    protected function notifyAdmins(MeloOrder $order, array $cartData, User $user): void
    {
        $roles = $this->app->config('checkout.receiver_roles') ?? ['superuser', 'manager', 'admin'];

        $users = $this->orm->from(User::class)
            ->where('user.receive_mail', 1)
            ->where('user.enabled', 1)
            ->where('user.verified', 1)
            ->whereExists(
                fn(Query $query) => $query->from(UserRoleMap::class)
                    ->whereRaw('user_id = user.id')
                    ->whereRaw('role_id IN(%r)', implode(',', $query->quote($roles)))
            )
            ->all(User::class);

        $isAdmin = true;

        if (count($users)) {
            $emails = $users->column('email')->dump();

            $this->mailer->createMessage(
                $this->trans(
                    'melo.mail.new.order.subject.for.admin',
                    no:       $order->no,
                    buyer:    $user->name,
                    sitename: $this->melo->config('shop.sitename'),
                )
            )
                ->bcc(...$emails)
                ->renderBody(
                    'mail.new-order',
                    compact('order', 'cartData', 'isAdmin')
                )
                ->send();
        }
    }
}
