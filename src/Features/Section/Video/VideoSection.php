<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Section\Video;

use Lyrasoft\Melo\Features\Section\AbstractSectionDefine;
use Windwalker\Utilities\Contract\LanguageInterface;

class VideoSection extends AbstractSectionDefine
{
    public static function id(): string
    {
        return 'video';
    }

    public static function icon(): string
    {
        return 'fas fa-video';
    }

    public static function title(LanguageInterface $lang): string
    {
        return '影片';
    }

    public static function description(LanguageInterface $lang): string
    {
        return '嵌入影片內容，讓學生可以觀看教學影片。';
    }
}
