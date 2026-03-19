<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Order;

use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Enum\OrderHistoryType;
use Lyrasoft\Melo\Enum\OrderState;
use Lyrasoft\Melo\Features\OrderService;
use Windwalker\Core\Database\ORMAwareTrait;
use Windwalker\Core\Events\Console\MessageOutputTrait;
use Windwalker\Core\Manager\Logger;
use Windwalker\DI\Attributes\Service;

use function Windwalker\chronos;

#[Service]
class OrderExpireScheduler
{
    use ORMAwareTrait;
    use MessageOutputTrait;

    public function __construct(protected OrderService $orderService)
    {
    }

    public function run(\DateTimeInterface|string $now = 'now'): void
    {
        $now = chronos($now);

        $orders = $this->orm->from(MeloOrder::class)
            ->where('paid_at', null)
            ->where('cancelled_at', null)
            ->where('expired_on', '<', $now)
            ->where('created', '<', $now->modify('-1month'))
            ->getIterator(MeloOrder::class);

        /** @var MeloOrder $order */
        foreach ($orders as $order) {
            $message = sprintf(
                'Order (%s) #%s has expired. Created at: %s, Expired on: %s',
                $order->id,
                $order->no,
                $order->created->format('Y-m-d H:i:s'),
                $order->expiredOn?->format('Y-m-d H:i:s') ?? 'N/A'
            );
            $this->emitMessage($message);
            Logger::info('melo/order-expired', $message);

            $this->orderService->changeState(
                $order,
                OrderState::CANCELLED,
                OrderHistoryType::SYSTEM,
                '訂單已過期，由系統自動取消',
                true
            );
        }
    }
}
