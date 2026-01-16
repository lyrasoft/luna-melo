<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\MeloOrder;

class CheckoutParams
{
    public function __construct(
        public MeloOrder $order,
        public User $user,
        public CartData $cartData
    ) {
    }
}
