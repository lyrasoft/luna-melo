<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        SegmentEditView  The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Module\Admin\Segment\SegmentEditView;
use Unicorn\Script\VueScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Form\Form;

/**
 * @var $form Form
 * @var $item Segment
 */

// $app->service(VueScript::class)->vue();
// $asset->js('vendor/lyrasoft/melo/dist/admin/segment-edit/index.js');
?>

@extends('melo.admin.lesson-edit-layout', ['lessonId' => $lessonId])

@section('content')
    <div class="l-segment-edit">
        <div class="l-segment-edit__card-body">
            <segment-edit-app id="segment-edit-app"></segment-edit-app>
        </div>
    </div>
@stop
