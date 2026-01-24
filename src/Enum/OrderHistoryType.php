<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Enum;

use Windwalker\Utilities\Attributes\Enum\Title;
use Windwalker\Utilities\Enum\EnumSingleton;
use Windwalker\Utilities\Enum\EnumTranslatableInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;
use Windwalker\Utilities\Contract\LanguageInterface;

enum OrderHistoryType: string implements EnumTranslatableInterface
{
    use EnumTranslatableTrait;

    #[Title('使用者')]
    case MEMBER = 'member';

    #[Title('管理者')]
    case ADMIN = 'admin';

    #[Title('系統')]
    case SYSTEM = 'system';

    public static function preprocessValue(mixed $value): mixed
    {
        return $value ?: self::MEMBER;
    }

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('melo.order.history.type.' . $this->getKey());
    }
}
