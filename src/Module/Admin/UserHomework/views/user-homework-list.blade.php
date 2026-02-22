<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        UserHomeworkListView The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Workflow\HomeworkStatusWorkflow;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Lyrasoft\Melo\Module\Admin\UserHomework\UserHomeworkListView;

/**
 * @var $item UserSegmentMap
 */

$workflow = $app->service(HomeworkStatusWorkflow::class);
?>

@section('toolbar-buttons')
    @include('list-toolbar')
@stop

<x-lesson-edit-layout :lesson="$lesson" card>
    <form id="admin-form" action="" x-data="{ grid: $store.grid }"
        x-ref="gridForm"
        data-ordering="{{ $ordering }}"
        method="post">

        <x-filter-bar :form="$form" :open="$showFilters"></x-filter-bar>

        {{-- RESPONSIVE TABLE DESC --}}
        <div class="d-block d-lg-none mb-3">
            @lang('unicorn.grid.responsive.table.desc')
        </div>

        <div class="grid-table table-responsive-lg">
            <table class="table table-striped table-hover table-bordered">
                <thead>
                <tr>
                    <th class="text-nowrap">
                        狀態
                    </th>

                    <th class="text-nowrap">
                        作業檔案
                    </th>

                    <th class="text-nowrap">
                        作業描述
                    </th>

                    {{-- Title --}}
                    <th class="text-nowrap">
                        <x-sort field="segment.title">
                            章節名稱
                        </x-sort>
                    </th>

                    <th class="text-nowrap">
                        <x-sort field="user.name">
                            學生
                        </x-sort>
                    </th>

                    {{-- ID --}}
                    <th style="width: 1%" class="text-nowrap text-end">
                        <x-sort field="user_homework.id">
                            @lang('unicorn.field.id')
                        </x-sort>
                    </th>
                </tr>
                </thead>

                <tbody>
                @forelse($items as $i => $item)
                    <tr>
                        {{-- State --}}
                        <td>
                            <x-state-dropdown color-on="text"
                                button-style="width: 100%"
                                :workflow="$workflow"
                                :id="$item->id"
                                :value="$item->status"
                            ></x-state-dropdown>
                        </td>

                        <td class="text-nowrap">
                            @if ($item->assignment)
                                <a href="{{ $item->assignment }}" target="_blank"
                                    class="btn btn-sm btn-primary">
                                    觀看作業檔案
                                </a>
                            @endif
                        </td>

                        <td>
                            {{ \Windwalker\str($item->description)->truncate(80, '...') }}
                        </td>

                        <td>
                            {{ $item->segment->title }}
                        </td>

                        <td class="text-nowrap">
                            {{ $item->user->name }}
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
