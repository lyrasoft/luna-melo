<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Lyrasoft\Melo\Cart\Price\PriceSet;
use Lyrasoft\Melo\Entity\Lesson;

class CartItem
{
    public function __construct(
        public string $uid,
        public string $hash,
        public Lesson $lesson,
        public PriceSet $prices,
        public PriceSet $totals,
    ) {
    }
}
