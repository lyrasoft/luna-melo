<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Event;

use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderHistory;
use Lyrasoft\Melo\Enum\OrderState;
use Windwalker\Event\BaseEvent;

class AfterOrderStateChangeEvent extends BaseEvent
{
    public function __construct(
        public MeloOrder $order,
        public OrderState $from,
        public OrderState $to,
        public MeloOrderHistory $history,
        public bool $notify = false,
    ) {
    }
}
