<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        LessonEditView  The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Module\Admin\Lesson\LessonEditView;
use Unicorn\Script\FormScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Form\Form;

/**
 * @var $form Form
 * @var $item Lesson
 */

// $formService = $app->service(FormScript::class)
//     ->listDependent(
//         '#input-item-sub_category_id',
//         '#input-item-category_id',
//         $nav->to('category_ajax_list')->var('type', 'lesson'),
//         [
//             'default_value' => $subCategoryIds,
//         ]
//     );

?>

@extends('melo.admin.lesson-edit-layout', ['lessonId' => $item?->id])

@section('toolbar-buttons')
    @include('edit-toolbar')
@stop

@section('content')
    <form name="admin-form" id="admin-form"
        uni-form-validate='{"scroll": true}'
        action="{{ $nav->to('lesson_edit') }}"
        method="POST" enctype="multipart/form-data">

        <x-title-bar :form="$form" ns="item"></x-title-bar>

        <div class="row">
            <div class="col-lg-7">
                <x-fieldset name="basic" :title="$lang('unicorn.fieldset.basic')"
                    :form="$form"
                    class="mb-4"
                    is="card"
                >
                </x-fieldset>
                <x-fieldset name="content" title="課程介紹"
                    :form="$form"
                    class="mb-4"
                    is="card"
                >
                </x-fieldset>
                <div class="card mb-4">
                    <div class="card-body ">
                        <h4 class="card-title mb-4">
                            課程檔案
                        </h4>
                        <x-attachment-field
                            :items="$attachments"
                            :insertBtn="false"
                            accept=".pdf,.jpg,.zip,.png"
                            multiple
                        >
                        </x-attachment-field>
                    </div>
                </div>
            </div>
            <div class="col-lg-5">
                <x-fieldset name="info" title="課程設定"
                    :form="$form"
                    class="mb-4"
                    is="card"
                >
                </x-fieldset>
                <x-fieldset name="meta" :title="$lang('unicorn.fieldset.meta')"
                    :form="$form"
                    class="mb-4"
                    is="card"
                >
                </x-fieldset>
            </div>
        </div>

        <div class="d-none">
            @if ($idField = $form?->getField('item/id'))
                <input name="{{ $idField->getInputName() }}" type="hidden" value="{{ $idField->getValue() }}" />
            @endif

            <x-csrf></x-csrf>
        </div>
    </form>
@stop
