<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Windwalker\Core\DateTime\Chronos;
use Windwalker\Data\RecordInterface;
use Windwalker\Data\RecordTrait;

class InvoiceData implements RecordInterface
{
    use RecordTrait;

    public AddressInfo $address {
        set(array|AddressInfo $value) => AddressInfo::wrap($value);
    }

    public mixed $args = null;

    public mixed $info = null;

    public Chronos|null $issuedAt = null {
        set(\DateTimeInterface|string|null $value) => $this->issuedAt = Chronos::tryWrap($value);
    }

    public function __construct(
        public string $name = '',
        public string $title = '',
        public string $vat = '',
        public string $carrier = '',
        AddressInfo|array $address = new AddressInfo(),
    ) {
        $this->address = $address;
    }
}
