<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Section\Quiz;

use Lyrasoft\Melo\Features\Section\AbstractSectionDefine;
use Lyrasoft\Melo\Features\Section\LanguageInterface;
use Windwalker\Language\Language;

class QuizSection extends AbstractSectionDefine
{
    public static function id(): string
    {
        return 'quiz';
    }

    public static function icon(): string
    {
        return 'fas fa-pen-field';
    }

    public static function title(\Windwalker\Utilities\Contract\LanguageInterface $lang): string
    {
        return '測驗';
    }

    public static function description(\Windwalker\Utilities\Contract\LanguageInterface $lang): string
    {
        return '建立測驗題目，讓學生可以在線上作答並提交，可用題型：單選、複選、是非題。';
    }
}
