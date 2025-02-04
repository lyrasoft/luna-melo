<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Enum;

use Windwalker\Utilities\Attributes\Enum\Icon;
use Windwalker\Utilities\Attributes\Enum\Title;
use Windwalker\Utilities\Enum\EnumSingleton;
use Windwalker\Utilities\Enum\EnumTranslatableInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;
use Windwalker\Utilities\Contract\LanguageInterface;

enum SegmentType: string implements EnumTranslatableInterface
{
    use EnumTranslatableTrait;

    case DEFAULT = '';

    #[Title('影片')]
    #[Icon('fa-video')]
    case VIDEO = 'video';

    #[Title('作業')]
    #[Icon('fa-file')]
    case HOMEWORK = 'homework';

    #[Title('測驗')]
    #[Icon('fa-pen-to-square')]
    case QUIZ = 'quiz';

    public static function preprocessValue(mixed $value): mixed
    {
        return $value ?: self::DEFAULT;
    }

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('melo.segment.type.' . $this->getKey());
    }
}
