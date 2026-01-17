<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app       AppContext      Application context.
 * @var  $vm        MyLessonListView  The view model object.
 * @var $uri       SystemUri       System Uri information.
 * @var $chronos   ChronosService  The chronos datetime service.
 * @var $nav       Navigator       Navigator object to build route.
 * @var $asset     AssetService    The Asset manage service.
 * @var $lang      LangService     The language translation service.
 */

use Unicorn\Html\Breadcrumb;
use Lyrasoft\Melo\Module\Front\MyLesson\MyLessonListView;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

$breadcrumb = $app->service(Breadcrumb::class);

$breadcrumb->push($lang->trans('melo.my.lesson.page.title'));

?>

@extends('global.body')

@section('message', '')

@section('content')
    @include('melo.front.page-title', ['title' => $lang->trans('melo.my.lesson.page.title')])

    <div class="l-my-lesson-list">
        <div class="container">
            @include('@messages')

            <div class="row">
                <div class="col-lg-3 d-none d-lg-block">
                    @include('melo.front.profile-sidebar', ['info' => $userInfo])
                </div>

                <div class="col col-lg-9">
                    <div class="l-my-lesson-list__card-content">
                        <div class="row">
                            @foreach($items as $item)
                                <div class="col-md-6 col-xl-4 g-4">
                                    @include('melo.front.lesson.lesson-card', ['item' => $item])
                                </div>
                            @endforeach
                        </div>

                        <div class="c-pagination-content">
                            <div class="d-flex justify-content-center">
                                <x-pagination :pagination="$pagination" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop
