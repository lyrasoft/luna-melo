<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Lyrasoft\Melo\Cart\Price\PriceSet;

class CartData
{
    /**
     * @param  array<CartItem>  $items
     * @param  PriceSet         $totals
     */
    public function __construct(
        public array $items = [],
        public PriceSet $totals = new PriceSet(),
    ) {
    }
}
