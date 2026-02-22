<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        StudentLessonListView The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Melo\Module\Admin\Student\StudentLessonListView;
use Lyrasoft\Melo\Workflow\UserLessonStatusWorkflow;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var UserLessonMap $item
 */

$workflow = $app->service(UserLessonStatusWorkflow::class);
?>

@section('toolbar-buttons')
    @include('list-toolbar')
@stop

<x-lesson-edit-layout :lesson="$lesson" card>
    <div class="d-flex justify-content-between">
        <div class="mb-4">
            <a class="btn btn-outline-secondary" href="{{ $nav->to('student_list', ['lesson_id' => $lessonId]) }}">
                <i class="fa-solid fa-chevron-left"></i> 回學生列表頁
            </a>
        </div>

        <div class="mb-4">
            <div class="mb-2">
                學生姓名：{{ $user->getName() ?? '' }}
            </div>
            <div>
                Email：{{ $user->getEmail() ?? '' }}
            </div>
        </div>
    </div>

    <form id="admin-form" action="" x-data="{ grid: $store.grid }"
        x-ref="gridForm"
        data-ordering="{{ $ordering }}"
        method="post">

        {{-- RESPONSIVE TABLE DESC --}}
        <div class="d-block d-lg-none mb-3">
            @lang('unicorn.grid.responsive.table.desc')
        </div>

        <div class="grid-table table-responsive-lg">
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    {{-- Toggle --}}
                    <th style="width: 1%">
                        <x-toggle-all></x-toggle-all>
                    </th>

                    {{-- State --}}
                    <th style="width: 5%" class="text-nowrap">
                        <x-sort field="user_lesson_map.status">
                            @lang('unicorn.field.state')
                        </x-sort>
                    </th>

                    {{-- Title --}}
                    <th class="text-nowrap">
                        <x-sort field="lesson.title">
                            課程標題
                        </x-sort>
                    </th>

                    <th style="width: 10%" class="text-nowrap text-end">
                        課程金額
                    </th>

                    {{-- Created --}}
                    <th class="text-nowrap">
                        <x-sort field="user_lesson_map.created">
                            下單時間
                        </x-sort>
                    </th>

                    {{-- ID --}}
                    <th style="width: 1%" class="text-nowrap text-end">
                        <x-sort field="user_lesson_map.id">
                            @lang('unicorn.field.id')
                        </x-sort>
                    </th>
                </tr>
                </thead>

                <tbody>
                @forelse($items as $i => $item)
                    <tr>
                        {{-- Checkbox --}}
                        <td>
                            <x-row-checkbox :row="$i" :id="$item->id"></x-row-checkbox>
                        </td>

                        {{-- State --}}
                        <td>
                            <x-state-dropdown color-on="text"
                                button-style="width: 100%"
                                use-states
                                :workflow="$workflow"
                                :id="$item->id"
                                :value="$item->status"
                            ></x-state-dropdown>
                        </td>

                        {{-- Title --}}
                        <td>
                            {{ $item->lesson->title }}
                        </td>

                        <td class="text-nowrap text-end">
                            {{ number_format((int) $item->lesson->price) }}
                        </td>

                        <td class="text-nowrap">
                            {{ $chronos->toLocalFormat($item->created, 'Y-m-d H:i:s') }}
                        </td>

                        {{-- ID --}}
                        <td class="text-end">
                            {{ $item->id }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="30">
                            <div class="c-grid-no-items text-center" style="padding: 125px 0;">
                                <h3 class="text-secondary">@lang('unicorn.grid.no.items')</h3>
                            </div>
                        </td>
                    </tr>
                @endforelse
                </tbody>
            </table>

            <div>
                <x-pagination :pagination="$pagination"></x-pagination>
            </div>
        </div>

        <div class="d-none">
            <input name="_method" type="hidden" value="PUT" />
            <x-csrf></x-csrf>
        </div>

        <x-batch-modal :form="$form" namespace="batch"></x-batch-modal>
    </form>
</x-lesson-edit-layout>
