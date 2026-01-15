<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Windwalker\Data\RecordInterface;
use Windwalker\Data\RecordTrait;

class AddressInfo implements RecordInterface
{
    use RecordTrait;

    public function __construct(
        public string $city = '',
        public string $dist = '',
        public string $zip = '',
        public string $address = '',
    ) {
    }
}
