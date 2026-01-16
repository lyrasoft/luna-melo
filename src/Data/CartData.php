<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Lyrasoft\Melo\Cart\Price\PriceObject;
use Lyrasoft\Melo\Cart\Price\PriceSet;
use Lyrasoft\ShopGo\Entity\OrderItem;

class CartData
{
    /**
     * @param  array<OrderItem>  $items
     * @param  PriceSet  $totals
     */
    public function __construct(
        public array $items = [],
        public PriceSet $totals = new PriceSet(),
    ) {
    }
}
