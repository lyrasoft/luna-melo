<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Windwalker\Data\RecordInterface;
use Windwalker\Data\RecordTrait;

class PaymentParams implements RecordInterface
{
    use RecordTrait;

    public function __construct(
        public string $paymentTitle = '',
        public array $input = [],
        public array $info = []
    ) {
    }
}
