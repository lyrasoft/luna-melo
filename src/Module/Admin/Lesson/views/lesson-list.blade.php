<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        LessonListView The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use Lyrasoft\Melo\Entity\Lesson;
use Unicorn\Workflow\BasicStateWorkflow;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Lyrasoft\Melo\Module\Admin\Lesson\LessonListView;

/**
 * @var $item Lesson
 */

$workflow = $app->service(BasicStateWorkflow::class);
?>

@extends('admin.global.body-list')

@section('toolbar-buttons')
    @include('list-toolbar')
@stop

@section('content')
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
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    {{-- Toggle --}}
                    <th style="width: 1%">
                        <x-toggle-all></x-toggle-all>
                    </th>

                    {{-- State --}}
                    <th style="width: 5%" class="text-nowrap">
                        <x-sort field="lesson.state">
                            @lang('unicorn.field.state')
                        </x-sort>
                    </th>

                    {{-- Title --}}
                    <th class="text-nowrap">
                        <x-sort field="lesson.title">
                            @lang('unicorn.field.title')
                        </x-sort>
                    </th>

                    {{-- Category --}}
                    <th class="text-nowrap">
                        <x-sort field="lesson.category_id">
                            @lang('luna.article.field.category')
                        </x-sort>
                    </th>

                    <th style="width: 10%" class="text-nowrap">
                        <div class="d-flex w-100 justify-content-end">
                            <x-sort
                                asc="lesson.ordering ASC"
                                desc="lesson.ordering DESC"
                            >
                                @lang('unicorn.field.ordering')
                            </x-sort>
                            @if($vm->reorderEnabled($ordering))
                                <x-save-order class="ms-2"></x-save-order>
                            @endif
                        </div>
                    </th>

                    <th class="text-nowrap">
                        <x-sort field="lesson.created_by">
                            @lang('unicorn.field.author')
                        </x-sort>
                    </th>

                    <th class="text-nowrap">
                        <x-sort field="lesson.created">
                            @lang('unicorn.field.created')
                        </x-sort>
                    </th>

                    {{-- Delete --}}
                    <th style="width: 1%" class="text-nowrap">
                        @lang('unicorn.field.delete')
                    </th>

                    {{-- ID --}}
                    <th style="width: 1%" class="text-nowrap text-end">
                        <x-sort field="lesson.id">
                            ID
                        </x-sort>
                    </th>
                </tr>
                </thead>

                <tbody>
                @forelse($items as $i => $item)
                    <tr>
                        {{-- Checkbox --}}
                        <td>
                            <x-row-checkbox :row="$i" :id="$item->getId()"></x-row-checkbox>
                        </td>

                        {{-- State --}}
                        <td>
                            <x-state-dropdown color-on="text"
                                button-style="width: 100%"
                                use-states
                                :workflow="$workflow"
                                :id="$item->getId()"
                                :value="$item->state"
                            ></x-state-dropdown>
                        </td>

                        {{-- Title --}}
                        <td>
                            <div>
                                <a href="{{ $nav->to('lesson_edit')->id($item->getId()) }}">
                                    {{ $item->getTitle() }}
                                </a>
                            </div>
                        </td>

                        <td>
                            {{ $item->category->title }}
                        </td>

                        <td class="text-end">
                            <x-order-control
                                :enabled="$vm->reorderEnabled($ordering)"
                                :row="$i"
                                :id="$item->getId()"
                                :value="$item->ordering"
                            ></x-order-control>
                        </td>

                        <td class="text-nowrap">
                            {{ $item->teacher->name }}
                        </td>

                        <td class="text-nowrap">
                            {{ $chronos->toLocalFormat($item->getCreated(), 'Y-m-d') }}
                        </td>

                        {{-- Delete --}}
                        <td class="text-center">
                            <button type="button" class="btn btn-sm btn-outline-secondary"
                                @click="grid.deleteItem('{{ $item->getId() }}')"
                                data-dos
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>

                        {{-- ID --}}
                        <td class="text-end">
                            {{ $item->getId() }}
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

@stop
