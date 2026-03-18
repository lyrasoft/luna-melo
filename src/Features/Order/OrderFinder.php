<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Order;

use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Windwalker\Core\Database\ORMAwareTrait;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\SelectorQuery;

#[Service]
class OrderFinder
{
    use ORMAwareTrait;

    public function queryOrderItems(MeloOrder|int $order): SelectorQuery
    {
        $orderId = $order instanceof MeloOrder ? $order->id : $order;

        return $this->orm->from(MeloOrderItem::class, 'order_item')
            ->where('order_item.order_id', $orderId)
            ->setDefaultItemClass(MeloOrderItem::class);
    }

    /**
     * @param  MeloOrder|int  $order
     *
     * @return  Collection<MeloOrder>
     */
    public function getOrderItems(MeloOrder|int $order): Collection
    {
        return $this->queryOrderItems($order)->all(MeloOrderItem::class);
    }
}
