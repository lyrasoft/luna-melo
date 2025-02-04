<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Enum;

use Windwalker\Utilities\Attributes\Enum\Title;
use Windwalker\Utilities\Enum\EnumSingleton;
use Windwalker\Utilities\Enum\EnumTranslatableInterface;
use Windwalker\Utilities\Enum\EnumTranslatableTrait;
use Windwalker\Utilities\Contract\LanguageInterface;

enum QuestionType: string implements EnumTranslatableInterface
{
    use EnumTranslatableTrait;

    #[Title('單選題')]
    case SELECT = 'select';

    #[Title('多選題')]
    case MULTIPLE = 'multiple';

    #[Title('是非題')]
    case BOOLEAN = 'boolean';

    public static function preprocessValue(mixed $value): mixed
    {
        return $value ?: self::SELECT;
    }

    public function trans(LanguageInterface $lang, ...$args): string
    {
        return $lang->trans('melo.question.type.' . $this->getKey());
    }
}
