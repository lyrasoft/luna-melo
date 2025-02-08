<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Enum;

use Windwalker\Utilities\Attributes\Enum\Title;
use Windwalker\Utilities\Enum\EnumTranslatableInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;
use Windwalker\Utilities\Contract\LanguageInterface;

enum InvoiceType: string implements EnumTranslatableInterface
{
    use EnumTranslatableTrait;

    #[Title('個人')]
    case IDV = 'idv';

    #[Title('公司')]
    case COMPANY = 'company';

    public static function preprocessValue(mixed $value): mixed
    {
        return $value ?: self::IDV;
    }

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('melo.invoice.type.' . $this->getKey());
    }
}
