<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Windwalker\Data\RecordInterface;
use Windwalker\Data\RecordTrait;

class InvoiceData implements RecordInterface
{
    use RecordTrait;

    public function __construct(
        public string $name = '',
        public string $title = '',
        public string $vat = '',
        public string $carrier = '',
        public AddressInfo $address = new AddressInfo(),
    ) {
    }
}
