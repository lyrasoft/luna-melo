<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Enum;

use Windwalker\Utilities\Attributes\Enum\Title;
use Windwalker\Utilities\Enum\EnumSingleton;
use Windwalker\Utilities\Enum\EnumTranslatableInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;
use Windwalker\Utilities\Contract\LanguageInterface;

enum Payment: string implements EnumTranslatableInterface
{
    use EnumTranslatableTrait;

    #[Title('ATM')]
    case ATM = 'atm';

    #[Title('信用卡')]
    case CREDIT_CARD = 'credit-card';

    public static function preprocessValue(mixed $value): mixed
    {
        return $value ?: self::ATM;
    }

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('app.payment.' . $this->getKey());
    }
}
