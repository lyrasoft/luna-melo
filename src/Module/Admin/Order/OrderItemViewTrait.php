<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Order;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Cart\Price\PriceObject;
use Lyrasoft\Melo\Cart\Price\PriceSet;
use Lyrasoft\Melo\Entity\MeloOrderHistory;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Entity\MeloOrderTotal;
use Lyrasoft\ShopGo\Entity\OrderItem;
use Windwalker\Data\Collection;

trait OrderItemViewTrait
{
    /**
     * @param  int  $orderId
     *
     * @return  Collection<OrderItem>
     *
     * @throws \ReflectionException
     */
    public function getOrderItems(int $orderId): Collection
    {
        return $this->orm->findList(
            MeloOrderItem::class,
            [
                'order_id' => $orderId,
            ]
        )->all();
    }

    /**
     * @param  int  $orderId
     *
     * @return  Collection<MeloOrderHistory>
     */
    public function getHistories(int $orderId): Collection
    {
        return $this->orm->from(MeloOrderHistory::class)
            ->leftJoin(
                User::class,
                'user',
                'user.id',
                'melo_order_history.created_by'
            )
            ->where('order_id', $orderId)
            ->order('created', 'DESC')
            ->groupByJoins()
            ->all(MeloOrderHistory::class);
    }

    public function getTotalPriceSet(int $orderId): PriceSet
    {
        $totalItems = $this->getTotals($orderId)
            ->map(
                function (MeloOrderTotal $total) {
                    return new PriceObject(
                        $total->code,
                        (string) $total->value,
                        $total->title,
                        $total->params
                    );
                }
            );

        $totals = new PriceSet();

        foreach ($totalItems as $totalItem) {
            $totals->set($totalItem);
        }

        return $totals;
    }

    /**
     * @param  int  $orderId
     *
     * @return  Collection<MeloOrderTotal>
     */
    public function getTotals(int $orderId): Collection
    {
        return $this->orm->from(MeloOrderTotal::class)
            ->where('order_id', $orderId)
            ->order('ordering', 'ASC')
            ->all(MeloOrderTotal::class);
    }
}
