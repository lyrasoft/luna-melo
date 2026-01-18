<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Windwalker\Data\RecordInterface;
use Windwalker\Data\RecordTrait;

class QnOption implements RecordInterface
{
    use RecordTrait;

    public function __construct(
        public string $id,
        public string $value = '',
        public string $text = '',
        public bool $isAnswer = false,
    ) {
    }
}
