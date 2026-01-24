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

use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderItem;
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
 * @var $item      MeloOrder
 * @var $orderItem MeloOrderItem
 */

$alert = $item->params['alert'] ?? [];
?>

@extends('admin.global.body-edit')

@section('toolbar-buttons')
    @include('edit-toolbar')
@stop

@section('content')
    <form name="admin-form" id="admin-form"
        uni-form-validate='{"scroll": true}'
        action="{{ $nav->to('melo_order_edit') }}"
        method="POST" enctype="multipart/form-data"
        class="d-flex flex-column gap-4"
    >
        @if ($alert)
            @foreach ($alert as $msg)
                <div class="alert alert-warning">
                    {{ $msg }}
                </div>
            @endforeach
        @endif

        <div class="row">
            <div class="col-lg-8">
                <x-melo.order-info.order-intro :item="$item" />
            </div>
            <div class="col-lg-4">
                <x-melo.order-info.invoice-info :item="$item" full />
            </div>
        </div>

        <x-melo.order-info.order-items :item="$item" :totals="$totals" :order-items="$orderItems" />

        <div class="row">
            <div class="col-lg-5">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div>
                            訂單歷史
                        </div>
                        <div class="d-flex justify-content-end">
                            <a href="javascript://" class="btn btn-sm btn-info"
                                style="width: 150px"
                                data-bs-toggle="modal"
                                data-bs-target="#state-change-modal"
                            >
                                變更狀態
                            </a>
                        </div>
                    </div>

                    <x-order-histories :histories="$histories" class="list-group-flush"></x-order-histories>
                </div>
            </div>
            <div class="col-lg-7">
                <x-fieldset name="invoice" title="發票資訊"
                    is="card"
                    :form="$form"
                ></x-fieldset>
            </div>
        </div>

        <div class="d-none">
            @if ($idField = $form?->getField('item/id'))
                <input name="{{ $idField->getInputName() }}" type="hidden" value="{{ $idField->getValue() }}" />
            @endif

            <x-csrf></x-csrf>
        </div>
    </form>

    <x-state-change-modal :item="$item" />
@stop
