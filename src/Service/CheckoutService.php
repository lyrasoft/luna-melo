<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Service;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\Entity\UserRoleMap;
use Lyrasoft\Melo\Cart\Price\PriceObject;
use Lyrasoft\Melo\Cart\Price\PriceSet;
use Lyrasoft\Melo\Entity\Order;
use Lyrasoft\Melo\Entity\OrderItem;
use Lyrasoft\Melo\Entity\OrderTotal;
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
        Order $orderData,
        array $cartData,
        array $input
    ): Order {
        $totals = (float) $cartData['totals']->get('lesson_total')->__toString();
        $grandTotal = (float) $cartData['totals']->get('grand_total')->__toString();

        if ($grandTotal < 0) {
            throw new ValidateFailException('Cannot process checkout for negative price.');
        }

        $orderData->setTotal($grandTotal);
        $orderData->setState(OrderState::PENDING);
        $orderData->setExpiredOn(
            $this->melo->config('checkout.default_expiry') ?? '+7days'
        );

        $order = $this->orm->createOne(Order::class, $orderData);

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
            $order->getState() === OrderState::PAID
            || $order->getState() === OrderState::FREE
        ) {
            $this->orderService->assignLessonToUser($order->getId());
        }

        return $order;
    }

    public function createOrderItems(Order $order, array $cartData): \Windwalker\Data\Collection
    {
        $cartItems = $cartData['items'] ?? [];

        $orderItems = collect();

        foreach ($cartItems as $item) {
            $orderItem = new OrderItem();

            $orderItem->setOrderId($order->getId());
            $orderItem->setLessonId((int) $item['id']);
            $orderItem->setTitle($item['title']);
            $orderItem->setImage($item['image']);
            $orderItem->setLessonData($item);
            $orderItem->setPrice((float) $item['prices']->get('final')->__toString());
            $orderItem->setTotal((float) $item['prices']->get('final')->__toString());
            $orderItem->setPriceSet((array) $item['prices']);

            $orderItem = $this->orm->createOne($orderItem);

            $orderItems[] = $orderItem;
        }

        return $orderItems;
    }

    public function createOrderTotals(Order $order, PriceSet $totals): \Windwalker\Data\Collection
    {
        $i = 1;

        $orderTotals = collect();

        /** @var PriceObject $total */
        foreach ($totals as $total) {
            $orderTotal = new OrderTotal();
            $orderTotal->setOrderId($order->getId());
            $orderTotal->setType(
                str_starts_with($total->getName(), 'discount')
                    ? 'discount'
                    : 'total'
            );
            $orderTotal->setCode($total->getName());
            $orderTotal->setTitle($total->getLabel());
            $orderTotal->setValue($total->getPrice()->toFloat());
            $orderTotal->setParams($total->getParams());
            $orderTotal->setDiscountId($total->getParams()['discount_id'] ?? 0);
            $orderTotal->setDiscountType($total->getParams()['discount_type'] ?? '');
            $orderTotal->setOrdering($i);
            $orderTotal->setProtect($orderTotal->getType() === 'total');

            $this->orm->createOne(OrderTotal::class, $orderTotal);

            $orderTotals[] = $orderTotal;

            $i++;
        }

        return $orderTotals;
    }

    /**
     * @throws RandomException
     */
    protected function prepareOrderAndPaymentNo(Order $order, bool $test = false): Order
    {
        $no = $this->orderService->createOrderNo($order->getId());
        $tradeNo = $this->orderService->getPaymentNo($no, $test);

        // Save NO
        $this->orm->updateWhere(
            Order::class,
            ['no' => $no, 'payment_no' => $tradeNo],
            ['id' => $order->getId()]
        );

        $order->setNo($no);
        $order->setPaymentNo($tradeNo);

        return $order;
    }

    public function notifyForCheckout(Order $order, array $cartData, User $user): Order
    {
        $userMail = $user->getEmail();

        if ($userMail) {
            $this->notifyBuyer($order, $cartData, $user);
        }

        // Notify admins
        $this->notifyAdmins($order, $cartData, $user);

        return $order;
    }


    protected function notifyBuyer(Order $order, array $cartData, User $user): void
    {
        $isAdmin = false;

        $this->mailer->createMessage(
            $this->trans(
                'melo.mail.new.order.subject.for.buyer',
                no: $order->getNo(),
                sitename: $this->melo->config('shop.sitename'),
            )
        )
            ->to($user->getEmail())
            ->renderBody(
                'mail.order.new-order',
                compact('order', 'cartData', 'isAdmin')
            )
            ->send();
    }

    protected function notifyAdmins(Order $order, array $cartData, User $user): void
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
                    no:       $order->getNo(),
                    buyer:    $user->getName(),
                    sitename: $this->melo->config('shop.sitename'),
                )
            )
                ->bcc(...$emails)
                ->renderBody(
                    'mail.order.new-order',
                    compact('order', 'cartData', 'isAdmin')
                )
                ->send();
        }
    }
}
