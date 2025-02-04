<?php

declare(strict_types=1);

namespace App\View;

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

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Unicorn\Legacy\Html\MenuHelper;

$app->service(\Windwalker\Core\Html\HtmlFrame::class)
    ->addBodyClass('sidebar-enable vertical-collpsed');

$menuHelper = $app->service(MenuHelper::class);

$lessonId ??= null;
?>

@extends('admin.global.body-edit')

@section('content-container')
    @include('@messages')

    <div class="row">
        @if($lessonId)
            <div class="col-12">
                <div class="mb-4">
                    <ul class="nav nav-pills">
                        <li class="nav-item">
                            <a class="nav-link {{ $menuHelper->active('lesson_edit') }}"
                                href="{{ $nav->to('lesson_edit', ['id' => $lessonId]) }}">
                                基本資料
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $menuHelper->active('segment_edit') }}"
                                href="{{ $nav->to('segment_edit', ['lesson_id' => $lessonId]) }}">
                                章節編輯
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $menuHelper->active('user_quiz_list') }}"
                                href="{{ $nav->to('user_quiz_list', ['lesson_id' => $lessonId]) }}">
                                考試報表
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $menuHelper->active('user_homework_list') }}"
                                href="{{ $nav->to('user_homework_list', ['lesson_id' => $lessonId]) }}">
                                作業瀏覽
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $menuHelper->active(['student_list', 'student_lesson_list']) }}"
                                href="{{ $nav->to('student_list', ['lesson_id' => $lessonId]) }}">
                                學生列表
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        @endif

        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    @yield('content', 'Content')
                </div>
            </div>
        </div>
    </div>
@stop
