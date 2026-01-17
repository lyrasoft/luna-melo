<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderHistory;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Entity\UserAnswer;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\OrderHistoryType;
use Lyrasoft\Melo\Enum\OrderState;
use Lyrasoft\Melo\Features\Lesson\LessonDispatcher;
use Lyrasoft\Melo\MeloPackage;
use Lyrasoft\ShopGo\Entity\OrderHistory;
use Lyrasoft\ShopGo\Entity\OrderItem;
use Lyrasoft\Toolkit\Encode\BaseConvert;
use Random\RandomException;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Form\Exception\ValidateFailException;
use Windwalker\Core\Mailer\MailerInterface;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;
use Windwalker\Utilities\Str;

#[Service]
class OrderService
{
    public function __construct(
        protected ApplicationInterface $app,
        protected ORM $orm,
        protected MailerInterface $mailer,
        protected MeloPackage $melo,
        protected UserService $userService,
        protected LessonDispatcher $lessonDispatcher,
    ) {
    }

    public function createHistory(
        MeloOrder $order,
        ?OrderState $state,
        OrderHistoryType $type,
        string $message = '',
        bool $notify = false
    ): object {
        return $this->createHistoryByOrderId(
            $order->id,
            $state,
            $type,
            $message,
            $notify
        );
    }

    public function createHistoryByOrderId(
        int $orderId,
        OrderState|null $state,
        OrderHistoryType $type,
        string $message = '',
        bool $notify = false
    ): object {
        $history = new MeloOrderHistory();

        $history->type = $type;
        $history->createdBy = 0;
        $history->state = $state;
        $history->orderId = $orderId;
        $history->message = $message;
        $history->notify = $notify;

        return $this->orm->saveOne(MeloOrderHistory::class, $history);
    }

    public function changeState(
        MeloOrder|int $order,
        OrderState|null $state,
        OrderHistoryType $historyType,
        string $message = '',
        bool $notify = false,
    ): void {
        if (!$order instanceof MeloOrder) {
            $order = $this->orm->findOne(MeloOrder::class, ['id' => $order]);
        }

        if (!$order) {
            throw new ValidateFailException('Order not found.');
        }

        if ($order->state === $state) {
            return;
        }

        /** @var OrderHistory $history */
        $history = $this->orm->getDb()->transaction(function () use ($order, $historyType, $state, $notify, $message) {
            if ($state) {
                $order->state = $state;

                $this->orm->updateOne($order);

                if ($order->state === OrderState::PAID
                    || $order->state === OrderState::FREE
                ) {
                    $this->assignOrderLessonsToUser($order);
                }

                if ($order->state === OrderState::CANCELLED) {
                    $this->removeUserLesson($order->id);
                }
            }

            return $this->createHistory($order, $state, $historyType, $message, $notify);
        });

        if ($notify) {
            $user = $this->orm->findOne(User::class, ['id' => $order->userId]);

            if ($state) {
                $subject = sprintf(
                    '您的訂單 #%s 狀態變更為: %s',
                    $order->no,
                    $state->getTitle()
                );
            } else {
                $subject = sprintf(
                    '您的訂單 #%s 已更新',
                    $order->no,
                );
            }

            $mail = $this->mailer->createMessage($subject)
                ->renderBody(
                    'mail.order-changed',
                    [
                        'history' => $history,
                        'user' => $user,
                        'order' => $order,
                        'isAdmin' => false,
                    ]
                );

            $mail->to($user?->email);

            $mail->send();
        }
    }

    public function removeUserLesson(int $orderId): void
    {
        $order = $this->orm->mustFindOne(MeloOrder::class, ['id' => $orderId]);
        $orderItems = $this->orm->findList(MeloOrderItem::class, ['order_id' => $orderId]);

        /** @var MeloOrderItem $orderItem */
        foreach ($orderItems as $orderItem) {
            $this->orm->deleteBatch(
                UserLessonMap::class,
                [
                    'lesson_id' => $orderItem->lessonId,
                    'user_id' => $order->userId,
                ]
            );

            $this->orm->deleteBatch(
                UserSegmentMap::class,
                [
                    'lesson_id' => $orderItem->lessonId,
                    'user_id' => $order->userId,
                ]
            );

            $this->orm->deleteBatch(
                UserAnswer::class,
                [
                    'lesson_id' => $orderItem->lessonId,
                    'user_id' => $order->userId,
                ]
            );
        }
    }

    /**
     * @param  MeloOrder  $order
     * @param  array<OrderItem>  $orderItems
     *
     * @return  void
     */
    public function assignOrderLessonsToUser(MeloOrder $order, ?array $orderItems = null): void
    {
        $orderItems ??= $this->orm->from(OrderItem::class)
            ->where('order_id', $order->id)
            ->all(MeloOrderItem::class)
            ->dump();

        /** @var MeloOrderItem $orderItem */
        foreach ($orderItems as $orderItem) {
            $this->lessonDispatcher->assignLessonToUser($orderItem->lessonId, $order->userId);
        }
    }

    /**
     * @throws RandomException
     * @throws \Exception
     */
    public function createOrderNo(MeloOrder $order): string
    {
        $handler = $this->melo->config('order.no_handler');

        if ($handler && is_callable($handler)) {
            return $this->app->call(
                $handler,
                compact('order')
            );
        }

        return 'LS' . Str::padLeft((string) $order->id, 10, '0');
    }

    public static function getCurrentTimeBase62(): string
    {
        $t = (string) time();

        return BaseConvert::encode($t, BaseConvert::BASE62);
    }

    public function getPaymentNo(string $orderNo, bool $test = false): string
    {
        if (!$test) {
            return $orderNo;
        }

        $t = static::getCurrentTimeBase62();

        return $orderNo . 'T' . $t;
    }

    public function countUserOrders(?int $userId = null): int
    {
        $userId ??= $this->userService->getUser()->id;

        return $this->orm->from(MeloOrder::class)
            ->where('user_id', $userId)
            ->count();
    }

    //
    // /**
    //  * createInvoice
    //  *
    //  * @param Data $order
    //  *
    //  * @return  void
    //  *
    //  * @throws \Ecpay\Sdk\Exceptions\RtnException
    //  */
    // public function createInvoice(Data $order): void
    // {
    //     $type       = 'invoice';
    //     $merchantID = $this->config->get('ecpay.id');
    //
    //     $ecpay = $this->ecpayService->getEcpay(
    //         $type,
    //         'PostWithAesJsonResponseService'
    //     );
    //
    //     $orderItems = OrderItemMapper::find(['order_id' => $order->id]);
    //
    //     $dataItems = [];
    //
    //     foreach ($orderItems as $orderItem) {
    //         $dataItem = [];
    //
    //         $dataItem['ItemName']  = trim($orderItem->title);
    //         $dataItem['ItemCount'] = '1';
    //         $dataItem['ItemWord']  = '堂';
    //         $dataItem['ItemPrice'] = (string) $orderItem->price;
    //
    //         $dataItem['ItemTaxType'] = '3';
    //         $dataItem['ItemAmount']  = (string) $orderItem->total;
    //
    //         $dataItems[] = $dataItem;
    //     }
    //
    //     $totals = OrderTotalMapper::where('order_id = %q', $order->id)
    //         ->where('discount_id != 0')
    //         ->find();
    //
    //     foreach ($totals as $total) {
    //         $totalItem = [];
    //
    //         $totalItem['ItemName']  = Utf8String::substr($total->title, 0, 100);
    //         $totalItem['ItemCount'] = '1';
    //         $totalItem['ItemWord']  = '項';
    //         $totalItem['ItemPrice'] = (string) $total->value;
    //
    //         $totalItem['ItemTaxType'] = '3';
    //         $totalItem['ItemAmount']  = (string) $total->value;
    //
    //         $dataItems[] = $totalItem;
    //     }
    //
    //     $data = [
    //         'MerchantID' => $merchantID,
    //         'RelateNumber' => $order->payment_no,
    //         'Print' => '0',
    //         'Donation' => '0',
    //         'TaxType' => '3',
    //         'SalesAmount' => $order->total,
    //         'InvType' => '07',
    //         'CustomerName' => $order->invoice_name,
    //         'CustomerAddr' => $order->invoice_zip . $order->invoice_address,
    //         'CustomerEmail' => $order->email,
    //         'Items' => $dataItems,
    //     ];
    //
    //     if ($order->invoice_type === OrderService::INVOICE_TYPE_COMPANY) {
    //         $data['CustomerName']       = $order->invoice_title;
    //         $data['CustomerIdentifier'] = $order->invoice_vat;
    //         $data['Print'] = '1';
    //     }
    //
    //     $input = [
    //         'MerchantID' => $merchantID,
    //         'RqHeader' => [
    //             'Timestamp' => time(),
    //             'Revision' => '3.0.0',
    //         ],
    //         'Data' => $data,
    //     ];
    //
    //     $response = $ecpay->post($input, $this->ecpayService->getAction($type));
    //
    //     if ((int) $response['Data']['RtnCode'] !== 1) {
    //         throw new ValidateFailException($response['Data']['RtnMsg']);
    //     }
    //
    //     $order->invoice_no   = $response['Data']['InvoiceNo'];
    //     $order->invoice_date = $response['Data']['InvoiceDate'];
    //
    //     OrderMapper::updateOne($order);
    // }
    //
    // /**
    //  * @param string $range
    //  * @param string $payment
    //  *
    //  * @return  void
    //  *
    //  * @throws \Exception
    //  */
    // public function makeExpired(string $range, string $payment): void
    // {
    //     $dateTime = Chronos::create($range)->toSql();
    //
    //     $query = $this->db->getQuery(true);
    //
    //     $orders = $query->select('*')
    //         ->from(Table::ORDERS)
    //         ->where('status = %q', static::STATUS_UNPAID)
    //         ->where('payment = %q', $payment);
    //
    //     if ($payment === static::PAYMENT_CREDIT) {
    //         $orders = $orders->where('created < %q', $dateTime);
    //     }
    //
    //     if ($payment === static::PAYMENT_ATM) {
    //         $orders = $orders->where('expired_date < %q', $dateTime);
    //     }
    //
    //     foreach ($orders as $order) {
    //         $orderId = (int) $order->id;
    //
    //         $this->changeState(
    //             OrderHistoryService::TYPE_SYSTEM,
    //             $orderId,
    //             static::STATUS_EXPIRED,
    //             false,
    //             '超過付款期限，自動過期'
    //         );
    //
    //         $this->discountUsageService->clearOrderUsages($orderId);
    //     }
    // }
}
