<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Question\Boolean;

use Lyrasoft\Melo\Features\Question\AbstractQuestion;
use Windwalker\Utilities\Contract\LanguageInterface;

class BooleanQuestion extends AbstractQuestion
{
    public static function id(): string
    {
        return 'boolean';
    }

    public static function icon(): string
    {
        return 'fas fa-check-square';
    }

    public static function title(LanguageInterface $lang): string
    {
        return '是非題';
    }

    public static function description(LanguageInterface $lang): string
    {
        return '提供是或否的選項。';
    }
}
