<?php

declare(strict_types=1);

namespace App\view;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app       AppContext      Application context.
 * @var $vm        object          The view model object.
 * @var $uri       SystemUri       System Uri information.
 * @var $chronos   ChronosService  The chronos datetime service.
 * @var $nav       Navigator       Navigator object to build route.
 * @var $asset     AssetService    The Asset manage service.
 * @var $lang      LangService     The language translation service.
 */

use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Enum\SegmentType;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Features\Section\Homework\HomeworkSection;
use Lyrasoft\Melo\Features\Section\Quiz\QuizSection;
use Lyrasoft\Melo\Features\Section\Video\VideoSection;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var Segment $item
 */

$isActive ??= false;
$index ??= null;
$sectionOrderName ??= [
    'video' => [],
    'homework' => [],
    'quiz' => [],
];
$chapterIndex ??= null;
$link = null;

if (!$app->service(UserService::class)->isLogin()) {
    $link = $nav->to('login')->withReturn();
}

if ($item->type === VideoSection::id()) {
    $link = $nav->to(
        'lesson_item',
        [
            'id' => $item->lessonId,
            'segment_id' => $item->id
        ]
    );
}

$format = 'i:s';

if ($item->duration >= 3600) {
    $format = 'H:i:s';
}
?>

<a class="link-dark {{ $item->type !== VideoSection::id() ? 'j-section-modal' : '' }}"
    data-type="{{ $item->type }}" data-section-id="{{ $item->id }}"
    data-section-title="{{ $item->title }}" data-section-index="第{{ $chapterIndex }}章 第{{ $index }}節"
    data-section-content="{{ $item->content }}"
    href="{{ $link ?: 'javascript://' }}">
    <div class="c-section-item {{ $isActive ? 'active' : '' }}">
        <div class="c-section-item__inner">
            <div class="d-flex gap-2">
                <div>
                    @if($item->type === VideoSection::id())
                        <i class="fa-solid fa-circle-play"></i>
                    @else
                        <i class="fa-regular fa-circle-check"></i>
                    @endif
                </div>
                @if(count($sectionOrderName[$item->type]) > 0)
                    <div class="text-nowrap">
                        @switch($item->type)
                            @case(VideoSection::id())
                                單元
                                @break
                            @case(HomeworkSection::id())
                                作業
                                @break
                            @case(QuizSection::id())
                                測驗
                                @break
                        @endswitch
                        {{ count($sectionOrderName[$item->type]) }}
                    </div>
                @endif
                <div>
                    {{ $item->title }}
                </div>
            </div>

            <div class="text-nowrap">
                @if ($item->type === VideoSection::id())
                    {{ $chronos::toFormat((string) $item->duration, $format) }}
                @endif
            </div>
        </div>
    </div>
</a>

