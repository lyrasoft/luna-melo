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

use Lyrasoft\Melo\Service\LessonService;
use Unicorn\Legacy\Html\MenuHelper;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

$menuHelper = $app->service(MenuHelper::class);
$lessonService = $app->service(LessonService::class);
?>

<div class="c-user-card card border-0 shadow rounded-4">
    <div class="card-body text-center">
        <img src="{{ $info->avatar }}" class="c-user-card__avatar rounded-pill mb-4" alt="{{ $info->name }}">
        <div class="card-title h4">{{ $info->name }}</div>
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item px-0">
            <a class="d-flex justify-content-between {{ $menuHelper->active('profile_edit') }}"
                href="{{ $nav->to('profile_edit') }}">
                <div><i class="far fa-user-check fa-fw me-2"></i>帳號管理</div>
            </a>
        </li>
        <li class="list-group-item px-0">
            <a class="d-flex justify-content-between {{ $menuHelper->active('my_lesson') }}"
                href="{{ $nav->to('my_lesson_list') }}">
                <div>
                    <i class="far fa-book-open fa-fw me-2"></i>我的課程
                </div>
                <div>
                    {{ $lessonService->myLessonCount() }}
                </div>
            </a>
        </li>
        <li class="list-group-item px-0">
            <a class="d-flex justify-content-between {{ $menuHelper->active('my_lecture') }}"
                href="{{ $nav->to('my_lecture_list') }}">
                <div>
                    <i class="far fa-chalkboard fa-fw me-2"></i>我開的課
                </div>
                <div>
                    {{ $lessonService->myLectureCount() }}
                </div>
            </a>
        </li>
        <li class="list-group-item px-0">
            <a class="d-flex align-items-center" href="{{ $nav->to('logout') }}">
                <i class="far fa-sign-out fa-fw me-2"></i>
                <div>
                    登出
                </div>
            </a>
        </li>
    </ul>
</div>
