<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data\Question;

use Lyrasoft\Melo\Data\QnOption;
use Windwalker\Data\RecordInterface;
use Windwalker\Data\RecordTrait;

class SelectQnParams implements RecordInterface
{
    use RecordTrait;

    /**
     * @param  array<QnOption>  $options
     */
    public function __construct(
        public array $options = [] {
            set(array $value) => array_map(fn ($o) => QnOption::wrap($o), $value);
        },
    ) {
    }
}
