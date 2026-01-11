<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Question\MultiSelect;

use Lyrasoft\Melo\Features\Question\AbstractQuestion;
use Windwalker\Utilities\Contract\LanguageInterface;

class MultiSelectQuestion extends AbstractQuestion
{
    public static function id(): string
    {
        return 'multiple';
    }

    public static function icon(): string
    {
        return 'fas fa-list-ul';
    }

    public static function title(LanguageInterface $lang): string
    {
        return '多選題';
    }

    public static function description(LanguageInterface $lang): string
    {
        return '提供多個選項供使用者選擇。';
    }
}
