<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        OrderEditView  The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use Lyrasoft\Melo\Entity\Order;
use Lyrasoft\Melo\Entity\OrderItem;
use Lyrasoft\Melo\Module\Admin\Order\OrderEditView;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;
use Windwalker\Form\Form;

/**
 * @var $form      Form
 * @var $item      Order
 * @var $orderItem OrderItem
 */
?>

@extends('admin.global.body-edit')

@section('toolbar-buttons')
    @include('edit-toolbar')
@stop

@section('content')
    <form name="admin-form" id="admin-form"
        uni-form-validate='{"scroll": true}'
        action="{{ $nav->to('order_edit') }}"
        method="POST" enctype="multipart/form-data">

        <div class="row">
            <div class="col-lg-7">
                <x-fieldset name="basic" :title="$lang('unicorn.fieldset.basic')"
                    :form="$form"
                    class="mb-4"
                    is="card"
                >
                </x-fieldset>
            </div>
            <div class="col-lg-5">
                <x-fieldset name="meta" :title="$lang('unicorn.fieldset.meta')"
                    :form="$form"
                    class="mb-4"
                    is="card"
                >
                </x-fieldset>
            </div>

            <div class="col-lg-12">
                <div class="card mb-4">
                    <div class="card-body">
                        <h4 class="card-title mb-4">
                            購買品項
                        </h4>

                        <table class="table">
                            <thead>
                            <tr>
                                <th>品項</th>
                                <th>金額</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach ($orderItems as $orderItem)
                                <tr>
                                    <td>
                                        {{ $orderItem->title }}
                                    </td>
                                    <td>
                                        {{ number_format($orderItem->total) }}
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                            <tfoot>
                            <tr>
                                <td></td>
                                <td>總計 : {{ number_format($item->total) }}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-lg-12">
                <x-fieldset name="remit" title="匯款表單資料"
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
