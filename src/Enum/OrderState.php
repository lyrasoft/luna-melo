<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Enum;

use Windwalker\Utilities\Attributes\Enum\Color;
use Windwalker\Utilities\Attributes\Enum\Title;
use Windwalker\Utilities\Enum\EnumSingleton;
use Windwalker\Utilities\Enum\EnumTranslatableInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;
use Windwalker\Utilities\Contract\LanguageInterface;

enum OrderState: string implements EnumTranslatableInterface
{
    use EnumTranslatableTrait;

    #[Title('待處理')]
    #[Color('primary')]
    case PENDING = 'pending';

    #[Title('已付款')]
    #[Color('success')]
    case PAID = 'paid';

    #[Title('付款失敗')]
    #[Color('danger')]
    case FAILED = 'failed';

    #[Title('免費')]
    #[Color('info')]
    case FREE = 'free';

    #[Title('已取消')]
    #[Color('secondary')]
    case CANCELLED = 'cancelled';

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('melo.order.state.' . $this->name);
    }
}
