<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Section\Homework;

use Lyrasoft\Melo\Features\Section\AbstractSectionDefine;
use Windwalker\Language\Language;
use Windwalker\Utilities\Contract\LanguageInterface;

class HomeworkSection extends AbstractSectionDefine
{
    public static function id(): string
    {
        return 'homework';
    }

    public static function icon(): string
    {
        return 'fas fa-book-open';
    }

    public static function title(LanguageInterface $lang): string
    {
        return '作業';
    }

    public static function description(LanguageInterface $lang): string
    {
        return '布置作業給學生，讓學生可以在完成並線上提交。';
    }
}
