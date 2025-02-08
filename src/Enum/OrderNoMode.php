<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Enum;

use Windwalker\Utilities\Enum\EnumTranslatableInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;
use Windwalker\Utilities\Contract\LanguageInterface;

enum OrderNoMode: string implements EnumTranslatableInterface
{
    use EnumTranslatableTrait;

    case INCREMENT_ID = 'increment_id';
    case DAILY_SEQUENCE = 'daily_sequence';
    case SEQUENCE_HASHES = 'sequence_hashes';
    case RANDOM_HASHES = 'random_hashes';

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('melo.order.no.mode.' . $this->getKey());
    }
}
