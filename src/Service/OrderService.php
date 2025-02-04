<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Service;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\Order;
use Lyrasoft\Melo\Entity\OrderHistory;
use Lyrasoft\Melo\Entity\OrderItem;
use Lyrasoft\Melo\Entity\UserAnswer;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\OrderHistoryType;
use Lyrasoft\Melo\Enum\OrderNoMode;
use Lyrasoft\Melo\Enum\OrderState;
use Lyrasoft\Melo\Enum\UserLessonStatus;
use Lyrasoft\Melo\MeloPackage;
use Lyrasoft\Sequence\Service\SequenceService;
use Lyrasoft\Toolkit\Encode\BaseConvert;
use Random\RandomException;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Form\Exception\ValidateFailException;
use Windwalker\Core\Mailer\MailerInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;
use Windwalker\Utilities\Str;

use function Windwalker\now;

class OrderService
{
    public function __construct(
        protected ORM $orm,
        protected MailerInterface $mailer,
        #[Autowire]
        protected MeloPackage $melo,
        protected ApplicationInterface $app,
    ) {
    }

    public function createHistory(
        Order $order,
        ?OrderState $state,
        OrderHistoryType $type,
        string $message = '',
        bool $notify = false
    ): object {
        return $this->createHistoryByOrderId(
            $order->getId(),
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
        $history = new OrderHistory();

        $history->setType($type);
        $history->setCreatedBy(0);
        $history->setState($state);
        $history->setOrderId($orderId);
        $history->setMessage($message);
        $history->setNotify($notify);

        return $this->orm->saveOne(OrderHistory::class, $history);
    }

    public function changeState(
        OrderHistoryType $historyType,
        int $id,
        OrderState|null $state,
        bool $notify = false,
        string $message = ''
    ): void {
        $order = $this->orm->findOne(Order::class, ['id' => $id]);

        if (!$order) {
            throw new ValidateFailException('訂單編號: ' . $order->getNo() . 'ID: ' . $id . ' 找不到');
        }

        if ($order->getState() === $state) {
            return;
        }

        $this->orm->getDb()->transaction(function () use ($order, $historyType, $id, $state, $notify, $message) {
            $order->setState($state);

            $this->orm->updateOne(Order::class, $order, 'id');

            $history = $this->createHistory($order, $state, $historyType, $message, $notify);

            if ($order->getState() === OrderState::PAID
                || $order->getState() === OrderState::FREE
            ) {
                $this->assignLessonToUser($order->getId());
            }

            if ($order->getState() === OrderState::CANCELLED) {
                $this->removeUserLesson($order->getId());
            }

            if ($notify) {
                $user = $this->orm->findOne(User::class, ['id' => $order->getUserId()]);

                $subject = sprintf(
                    '您的訂單 #%s 狀態變更為: : %s',
                    $order->getNo(),
                    $state->getTitle()
                );

                $mail = $this->mailer->createMessage($subject)
                    ->renderBody(
                        'mail.order-changed',
                        [
                            'history' => $history,
                            'user' => $user,
                            'order' => $order,
                        ]
                    );

                $mail->to($user?->getEmail());

                $mail->send();
            }
        });
    }

    public function removeUserLesson(int $orderId): void
    {
        $order = $this->orm->mustFindOne(Order::class, ['id' => $orderId]);
        $orderItems = $this->orm->findList(OrderItem::class, ['order_id' => $orderId]);

        /** @var OrderItem $orderItem */
        foreach ($orderItems as $orderItem) {
            $this->orm->deleteWhere(
                UserLessonMap::class,
                [
                    'lesson_id' => $orderItem->getLessonId(),
                    'user_id' => $order->getUserId()
                ]
            );

            $this->orm->deleteWhere(
                UserSegmentMap::class,
                [
                    'lesson_id' => $orderItem->getLessonId(),
                    'user_id' => $order->getUserId()
                ]
            );

            $this->orm->deleteWhere(
                UserAnswer::class,
                [
                    'lesson_id' => $orderItem->getLessonId(),
                    'user_id' => $order->getUserId()
                ]
            );
        }
    }

    public function assignLessonToUser($orderId): void
    {
        $order = $this->orm->mustFindOne(Order::class, ['id' => $orderId]);
        $orderItems = $this->orm->findList(OrderItem::class, ['order_id' => $orderId]);

        /** @var OrderItem $orderItem */
        foreach ($orderItems as $orderItem) {
            $map = new UserLessonMap();

            $map->setLessonId($orderItem->getLessonId());
            $map->setUserId($order->getUserId());
            $map->setStatus(UserLessonStatus::PROCESS);

            $hasLesson = $this->orm->findOne(
                UserLessonMap::class,
                [
                    'lesson_id' => $orderItem->getLessonId(),
                    'user_id' => $order->getUserId(),
                ]
            );

            if (!$hasLesson) {
                $this->orm->createOne(
                    UserLessonMap::class,
                    $map
                );
            }
        }
    }

    /**
     * @throws RandomException
     * @throws \Exception
     */
    public function createOrderNo(int $id): string
    {
        $prefix = (string) $this->melo->config('order_no.prefix');
        $mode = OrderNoMode::wrap(
            $this->melo->config('order_no.mode') ?: OrderNoMode::INCREMENT_ID
        );

        if ($mode === OrderNoMode::INCREMENT_ID) {
            $availableLength = $this->getAvailableNoLength($prefix);

            return $prefix . Str::padLeft((string) $id, $availableLength, '0');
        }

        if ($mode === OrderNoMode::DAILY_SEQUENCE) {
            $sequenceService = $this->app->service(SequenceService::class);
            $format = $this->melo->config('order_no.sequence_day_format') ?: 'Ymd';
            $prefix .= now($format);

            $availableLength = $this->getAvailableNoLength($prefix);

            return $prefix . $sequenceService->getNextSerialAndPadZero('melo_order', $prefix, $availableLength);
        }

        if ($mode === OrderNoMode::SEQUENCE_HASHES) {
            $offsets = (int) $this->melo->config('order_no.hash_offsets');
            $seed = $this->melo->config('order_no.hash_seed') ?: BaseConvert::BASE62;
            $hash = BaseConvert::encode($id + $offsets, $seed);

            return $prefix . $hash;
        }

        if ($mode === OrderNoMode::RANDOM_HASHES) {
            $uid = bin2hex(random_bytes(6));
            $seed = $this->melo->config('order_no.hash_seed') ?: BaseConvert::BASE62;

            do {
                $no = $prefix . BaseConvert::encode(base_convert($uid, 16, 10), $seed);

                $exists = $this->orm->findOne(Order::class, ['no' => $no]);
            } while ($exists !== null);

            return $no;
        }

        throw new \RuntimeException('Order no config wrong');
    }

    protected function getAvailableNoLength(string $prefix): int
    {
        $maxlength = (int) $this->melo->config('order_no.maxlength') ?: 20;

        $t = static::getCurrentTimeBase62();

        $availableLength = $maxlength - strlen($t) - strlen($prefix) - 1;

        return min($availableLength, 11);
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
