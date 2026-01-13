<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        LessonListView  The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use Unicorn\Html\Breadcrumb;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

$breadcrumb = $app->service(Breadcrumb::class);

$breadcrumb->push($lang->trans('melo.lesson.search.page.title'));
?>

@extends('global.body')

@section('message', '')

@section('content')
    @include('melo.front.page-title', ['title' => $lang->trans('melo.lesson.search.page.title')])

    <div class="container">
        @include('@messages')

        <div class="c-filter-bar card">
            <form action="{{ $nav->to('lesson_list') }}" class="c-filter-bar__form card-body" method="get">
                <div class="d-flex gap-4">
                    {{-- Search Inputs --}}
                    <div class="row row-cols-3 flex-grow-1">
                        <div class="col">
                            <select id="input-item-category" name="category"
                                class="form-select" aria-label="lesson category"
                            >
                                <option {{ $categoryId === 0 ? 'selected' : '' }} value="">
                                    - 選擇課程分類 -
                                </option>
                                @foreach($categories as $category)
                                    <option
                                        value="{{ $category->getId() }}" {{ $categoryId === $category->getId() ? 'selected' : '' }}>
                                        {{ $category->getTitle() }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col">
                            <select name="teacher" class="form-select" aria-label="teachers">
                                <option selected value="">
                                    - 選擇講師 -
                                </option>
                                @foreach($teachers as $teacher)
                                    <option
                                        value="{{ $teacher->getId() }}" {{ $teacherId === $teacher->getId() ? 'selected' : '' }}>
                                        {{ $teacher->getName() }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col">
                            <div class="d-flex gap-4">
                                <input type="text" name="search" class="form-control" id="lesson-filter"
                                    placeholder="課程關鍵字" value="{{ $search }}">

                            </div>
                        </div>
                    </div>

                    {{-- Actions --}}
                    <div>
                        <button type="submit" class="c-filter-bar__btn btn btn-primary text-nowrap"
                            style="min-width: 100px">
                            搜尋
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="c-lesson-cards">
        <div class="container">
            <div class="row">
                @foreach($items as $item)
                    <div class="col-md-6 col-lg-4 col-xl-3 g-4">
                        @include('melo.front.lesson.lesson-card', ['item' => $item])
                    </div>
                @endforeach
            </div>
        </div>

        <div class="c-pagination-content">
            <div class="d-flex justify-content-center">
                {!! $pagination->render() !!}
            </div>
        </div>
    </div>

    <div class="l-no-result {{ $total === 0 ?: 'd-none' }}">
        <div class="container text-center">
            <p>很抱歉，暫時無法找到 <span class="text-primary">key word</span> 相關的課程，<br>您可以嘗試其他的關鍵字搜尋看看喔！
            </p>
            <img src="{{ $asset->path('images/global/no-search-results.png') }}" alt="No search results"
                class="img-fluid">
        </div>
    </div>
@stop
