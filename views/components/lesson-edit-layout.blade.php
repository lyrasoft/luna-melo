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

use Lyrasoft\Luna\Services\MenuService;
use Lyrasoft\Melo\Entity\Lesson;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Unicorn\Legacy\Html\MenuHelper;
use Windwalker\Edge\Component\ComponentAttributes;

/**
 * @var $attributes ComponentAttributes
 * @var $lesson     ?Lesson
 * @var $card       bool
 */

$attributes = $attributes->class('l-lesson-edit-layout d-flex flex-column gap-3');

$menu = $app->make(MenuService::class)->createBuilder('lesson-edit-layout');

$menu->link('基本資料', $nav->to('lesson_edit')->id($lesson?->id));
$menu->link('章節編輯', $nav->to('segment_edit')->var('lesson_id', $lesson?->id));
$menu->link('考試報表', $nav->to('user_quiz_list')->var('lesson_id', $lesson?->id));
$menu->link('作業瀏覽', $nav->to('user_homework_list')->var('lesson_id', $lesson?->id));
$menu->link('學生列表', $nav->to('student_list')->var('lesson_id', $lesson?->id));

$links = $menu->getTree()->getChildren();

$wrapperTag = $card ? 'card' : 'div';
?>

@extends('admin.global.body-edit')

@section('content')
    <div {!! $attributes !!}>
        <div class="card">
            <div class="card-body p-2">
                <ul class="nav nav-pills">
                    @foreach ($links as $link)
                        <a @class(['nav-item nav-link', 'active' => $link->isActive(true), 'disabled' => !$lesson])
                        href="{{ $lesson ? $link->getLink() : '' }}">
                            @if ($link->getIcon())
                                <i class="{{ $link->getIcon() }}"></i>
                            @endif
                            {{ $link->getTitle() }}
                        </a>
                    @endforeach
                </ul>
            </div>
        </div>

        <x-component :is="$wrapperTag">
            <div class="">
                {!! $slot !!}
            </div>
        </x-component>
    </div>
@stop
