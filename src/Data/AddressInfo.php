<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Windwalker\Data\RecordInterface;
use Windwalker\Data\RecordTrait;

class AddressInfo implements RecordInterface, \Stringable
{
    use RecordTrait;

    public function __construct(
        public string $city = '',
        public string $dist = '',
        public string $zip = '',
        public string $address = '',
    ) {
    }

    public function format(): string
    {
        return "{$this->zip} {$this->city}{$this->dist}{$this->address}";
    }

    public function __toString(): string
    {
        return $this->format();
    }
}
