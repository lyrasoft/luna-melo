<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Question\Select;

use Lyrasoft\Melo\Features\Question\AbstractQuestion;
use Windwalker\Utilities\Contract\LanguageInterface;

class SelectQuestion extends AbstractQuestion
{
    public static function id(): string
    {
        return 'select';
    }

    public static function icon(): string
    {
        return 'fas fa-circle-dot';
    }

    public static function title(LanguageInterface $lang): string
    {
        return '單選題';
    }

    public static function description(LanguageInterface $lang): string
    {
        return '提供多個選項供使用者選擇其中一個。';
    }
}
