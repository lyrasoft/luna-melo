<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Enum;

use Windwalker\Utilities\Attributes\Enum\Title;
use Windwalker\Utilities\Enum\EnumTranslatableInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;
use Windwalker\Utilities\Contract\LanguageInterface;

enum UserLessonStatus: string implements EnumTranslatableInterface
{
    use EnumTranslatableTrait;

    #[Title('通過')]
    case PASSED = 'passed';

    #[Title('未通過')]
    case FAILED = 'failed';

    #[Title('進行中')]
    case PROCESS = 'process';

    public static function preprocessValue(mixed $value): mixed
    {
        return $value ?: self::PROCESS;
    }

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('melo.user.lesson.status.' . $this->getValue());
    }
}
