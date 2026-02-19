<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        LessonItemView  The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use Asika\BetterUnits\Duration;
use Brick\Math\BigDecimal;
use Lyrasoft\Attachment\Entity\Attachment;
use Lyrasoft\Melo\Data\LessonProgressContext;
use Lyrasoft\Melo\Data\SectionContent;
use Lyrasoft\Melo\Data\SectionMenuItem;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Features\Section\SectionComposer;
use Lyrasoft\Melo\Features\Section\Video\VideoSection;
use Lyrasoft\Melo\Features\VideoService;
use Lyrasoft\Luna\Entity\Tag;
use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Script\MeloScript;
use Unicorn\Html\Breadcrumb;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Module\Front\Lesson\LessonItemView;
use Unicorn\Image\ImagePlaceholder;
use Unicorn\Script\UnicornScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Renderer\RendererService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var Lesson                $item
 * @var Tag                   $tag
 * @var Segment               $currentSegment
 * @var Segment               $chapter
 * @var Segment               $section
 * @var Segment               $sectionSegment
 * @var User                  $teacher
 * @var Attachment[]          $attachments
 * @var LessonProgressContext $context
 * @var SectionMenuItem       $menuItem
 */

$breadcrumb = $app->service(Breadcrumb::class);

$breadcrumb->push($lang->trans('melo.lesson.search.page.title'), $nav->to('lesson_list'));
$breadcrumb->push($item->title);

$rendererService = $app->service(RendererService::class);
$videoService = $app->service(VideoService::class);
$userService = $app->service(UserService::class);
$sectionComposer = $app->service(SectionComposer::class);
$currentSectionInstance = $sectionComposer->makeInstance($currentSegment);
$sectionContent = new SectionContent($context);
$sectionTypeIndexes = [];

$durationText = Duration::from($totalDuration, 's')->humanize(
    [
        Duration::UNIT_HOURS => '%s小時',
        Duration::UNIT_MINUTES => '%s分鐘',
        Duration::UNIT_SECONDS => '%s秒',
    ],
    ''
);

$defaultUserImg = $app->service(ImagePlaceholder::class)->placeholderSquare();

$meloScript = $app->service(MeloScript::class);
$meloScript->lessonCart();
?>

@extends('global.body')

@push('macro')
    <script data-macro="front.lesson.item" lang="ts" type="module">
        import { injectCssToDocument } from '@windwalker-io/unicorn-next';
        import Plyr from 'plyr';
        import css from 'plyr/dist/plyr.css?inline';

        const player = new Plyr('#section-player');
        injectCssToDocument(css);
    </script>
@endpush

@section('message', '')

@section('content')
    @include('melo.front.page-title', ['title' => $item->title])

    <div class="container">
        @include('@messages')

        <div class="l-lesson-item d-flex flex-column gap-4">
            {{-- Tags --}}
            <div class="l-lesson-item__tags d-flex justify-content-between align-items-end">
                <div class="d-flex flex-wrap gap-3">
                    @foreach($tags as $tag)
                        <div class="c-tag">
                            #{{ $tag->title }}
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Top Sections --}}
            <div class="l-lesson-item__main">

                <div class="l-lesson-item__content">
                    <div class="row g-0">
                        <div class="col-lg-8">
                            <div class="l-lesson-item__section">
                                {!! $currentSectionInstance->renderContent($rendererService, $sectionContent) !!}
                            </div>
                        </div>

                        <div class="col-lg-4">
                            <div class="l-lesson-item__chapter c-segment-list">
                                <div class="c-segment-list__title">
                                    {{ $totalChapter }} 個章節 / {{ $totalSection }} 個單元 / {{ $durationText }}
                                </div>

                                <div class="c-segment-list__inner">
                                    @foreach($chapters as $i => $chapter)
                                        <a class="link-dark"
                                            href="#chapter-{{ $chapter->id }}-collapse"
                                            data-bs-toggle="collapse"
                                            aria-expanded="{{ $vm->activeChapter($chapters, $currentSegment) === $i }}"
                                        >
                                            <div class="c-chapter-item">
                                                <div>
                                                    第 {{ $i + 1 }} 章：{{ $chapter->title }}
                                                </div>
                                                <div>
                                                    <i class="fa-solid fa-circle-caret-down"></i>
                                                </div>
                                            </div>
                                        </a>

                                        <div
                                            class="c-section-list collapse {{ $vm->activeChapter($chapters, $currentSegment) === $i ? 'show' : '' }}"
                                            id="chapter-{{ $chapter->id }}-collapse">
                                            @foreach($sectionMenuGroup[$chapter->id] as $j => $menuItem)
                                                @php
                                                    $section = $sectionComposer->makeInstance($menuItem->section);
                                                @endphp

                                                <div
                                                    class="c-section-menu-item" @attr('data-section-id', $menuItem->section->id)>
                                                    {!! $section->renderSectionMenuItem($rendererService, $menuItem) !!}
                                                </div>
                                            @endforeach
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                        {{--  End row   --}}
                    </div>
                </div>
            </div>

            {{-- Tabs --}}
            <div class="l-lesson-item__navbar">
                <ul class="nav nav-pills nav-fill c-lesson-nav" role="tablist">
                    <li class="nav-item c-lesson-nav__item" role="presentation">
                        <button class="nav-link c-lesson-nav__link active" type="button"
                            id="lesson-detail-tab" data-bs-toggle="pill" data-bs-target="#lesson-detail"
                            role="tab" aria-controls="lesson-detail" aria-selected="true"
                        >
                            課程介紹
                        </button>
                    </li>
                    <li class="nav-item c-lesson-nav__item" role="presentation">
                        <button class="nav-link c-lesson-nav__link" type="button"
                            id="lesson-chapter-tab" data-bs-toggle="pill" data-bs-target="#lesson-chapter"
                            role="tab" aria-controls="lesson-chapter" aria-selected="false"
                        >
                            課程章節
                        </button>
                    </li>
                    <li class="nav-item c-lesson-nav__item" role="presentation">
                        <button class="nav-link c-lesson-nav__link" type="button"
                            id="lesson-homework-tab" data-bs-toggle="pill" data-bs-target="#lesson-homework"
                            role="tab" aria-controls="lesson-homework" aria-selected="false"
                        >
                            作業瀏覽
                        </button>
                    </li>
                    <li class="nav-item c-lesson-nav__item" role="presentation">
                        <a class="nav-link c-lesson-nav__link" type="button"
                            id="lesson-files-tab" data-bs-toggle="pill" data-bs-target="#lesson-files"
                            role="tab" aria-controls="lesson-files" aria-selected="false"
                        >
                            檔案下載
                        </a>
                    </li>
                </ul>
            </div>

            <div class="l-lesson-item__detail">
                <div class="row">
                    <div class="col-lg-8">
                        <div class="tab-content mb-4" id="pills-tabContent">

                            {{-- Introduction --}}
                            <div class="tab-pane fade show active card l-lesson-item__card c-lesson-detail-card"
                                id="lesson-detail" role="tabpanel" aria-labelledby="lesson-detail-tab">
                                <div class="card-body c-lesson-detail-card__body">
                                    <h4 class="card-title c-lesson-detail-card__title">
                                        課程簡介
                                    </h4>

                                    <div class="c-lesson-detail-card__content">
                                        <div class="d-flex mb-3">
                                            <div class="flex-grow-1">
                                                <i class="fa-regular fa-clock me-2 text-primary"></i>
                                                課程總時長｜{{ $durationText }}
                                            </div>
                                            <div class="flex-grow-1">
                                                <i class="fa-regular fa-rectangle-list me-2 text-primary"></i>
                                                單元數｜{{ $totalChapter }} 章節 {{ $totalSection }} 單元
                                            </div>
                                        </div>

                                        <div>
                                            {!! $item->description !!}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {{-- Chapter & Sections --}}
                            <div class="tab-pane fade card l-lesson-item__card c-lesson-detail-card"
                                id="lesson-chapter" role="tabpanel" aria-labelledby="lesson-chapter-tab"
                            >
                                <div class="card-body c-lesson-detail-card__title">
                                    <h4 class="card-title m-0">
                                        課程章節
                                    </h4>
                                </div>

                                <div class="list-group list-group-flush">
                                    @foreach($chapters as $k => $chapter)
                                        <div class="c-lesson-detail-chapter list-group-item bg-light">
                                            第 {{ $k + 1 }} 章：{{ $chapter->title }}
                                        </div>

                                        <div>
                                            @foreach($chapter->children as $l => $section)
                                                <div
                                                    class="c-lesson-detail-section list-group-item d-flex justify-content-between">
                                                    <div class="ps-4">
                                                        <i class="fa-fw {{ $sectionComposer->mustGetDefine($section)::icon() }} me-2"></i>
                                                        第 {{ $l + 1 }} 節 - {{ $section->title }}
                                                    </div>
                                                    <div>
                                                        {{ $chronos::toFormat((string) $section->duration, 'H:i:s') }}
                                                        <i class="fa-regular fa-circle-check ms-2"></i>
                                                    </div>
                                                </div>
                                            @endforeach
                                        </div>
                                    @endforeach
                                </div>
                            </div>

                            {{-- Homeworks --}}
                            <div class="tab-pane fade card l-lesson-item__card c-lesson-detail-card"
                                id="lesson-homework" role="tabpanel" aria-labelledby="lesson-homework-tab"
                            >
                                <x-homework-list />
                            </div>

                            <div class="tab-pane fade card l-lesson-item__card c-lesson-detail-card"
                                id="lesson-files" role="tabpanel" aria-labelledby="lesson-files-tab"
                            >
                                <div class="card-body c-lesson-detail-card__body">
                                    <div class="h4 c-lesson-detail-card__title">
                                        檔案下載
                                    </div>

                                    @if($context->hasAttended)
                                        @foreach($attachments as $file)
                                            <div class="c-file-item">
                                                <div>
                                                    {{ $file->title }}
                                                </div>
                                                <div>
                                                    <i class="fa-solid fa-arrow-down-to-line"></i>
                                                </div>
                                            </div>
                                        @endforeach
                                    @else
                                        <div class="border-top text-muted text-center py-5">
                                            本課程無檔案
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- Right Sidebar --}}
                    <div class="col-lg-4">
                        <div class="card c-lesson-progress-card mb-4">
                            <div class="card-body c-lesson-progress-card__body">
                                @if(!$userService->isLogin())
                                    <div class="d-grid mx-2">
                                        <a href="{{ $nav->to('login')->withReturn() }}" class="btn btn-primary btn-lg">
                                            登入
                                        </a>
                                    </div>
                                @elseif(!$context->hasAttended)
                                    <div class="d-grid mx-2">
                                        <button class="btn btn-primary btn-lg"
                                            data-melo-task="buy"
                                            data-id="{{ $item->id }}"
                                        >
                                            立即購買
                                        </button>
                                    </div>
                                @else
                                    <div class="d-flex justify-content-between">
                                        <div class="text-muted">
                                            課程進度
                                        </div>
                                        <div class="h2">
                                            {{ round($context->progress, 2) }}
                                        </div>
                                    </div>
                                @endif
                            </div>
                        </div>

                        @if($teacher)
                            <div class="card c-lesson-teacher-card">
                                <div class="card-body c-lesson-teacher-card__body">
                                    <div class="text-center mb-4">
                                        <img class="img-fluid c-teacher-avatar"
                                            style="width: 120px; height: 120px; object-fit: cover; border-radius: 50%;"
                                            src="{{ $teacher?->avatar }}"
                                            alt="{{ $teacher?->name }}"
                                        >
                                    </div>

                                    <div class="h4 text-center mb-4">
                                        {{ $teacher?->name }}
                                    </div>

                                    <div>
                                        {!! $teacher?->params['teacher_desc'] ?? '' !!}
                                    </div>
                                </div>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{--    @include('melo.front.lesson.homework-modal')--}}
    {{--    @include('melo.front.lesson.quiz-modal')--}}

    <div class="l-segment-hiddens">
        @foreach($chapters as $i => $chapter)
            <div class="l-chapter-hidden" data-chapter-hidden-id="{{ $chapter->id }}">
                @foreach($chapter->children as $j => $sectionSegment)
                    @php
                        $section = $sectionComposer->makeInstance($sectionSegment);
                        $sectionTypeIndexes[$sectionSegment->type] ??= 0;

                        $content = new SectionContent($context);
                    @endphp

                    <div class="l-section-hidden" data-section-hidden-id="{{ $sectionSegment->id }}">
                        {!! $section->renderHiddenContent($rendererService, $content) !!}
                    </div>
                @endforeach
            </div>
        @endforeach
    </div>
@stop
