<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        OrderItemView  The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use Lyrasoft\Melo\Entity\MeloOrderTotal;
use Lyrasoft\Melo\Features\Payment\MeloPaymentInterface;
use Unicorn\Html\Breadcrumb;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderHistory;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Enum\InvoiceType;
use Lyrasoft\Melo\Enum\OrderState;
use Lyrasoft\Melo\Module\Front\Order\OrderItemView;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

use function Lyrasoft\Melo\numberFormat;

/**
 * @var $item      MeloOrder
 * @var $history   MeloOrderHistory
 * @var $orderItem MeloOrderItem
 * @var $payment   ?MeloPaymentInterface
 * @var $totals    MeloOrderTotal[]
 */

$breadcrumb = $app->service(Breadcrumb::class);

$breadcrumb->push($lang->trans('melo.order.item.page.title'));
?>

@extends('global.body')

@section('message', '')

@section('content')
    @include('melo.front.page-title', ['title' => $lang->trans('melo.order.item.page.title')])

    <div class="l-order">
        <div class="container">

            @include('@messages')

            <div class="row">
                <div class="col-lg-3 d-none d-lg-block">
                    @include('melo.front.profile-sidebar', ['info' => $userInfo])
                </div>

                <div class="col-lg-9 d-flex flex-column gap-4">
                    <div class="card">
                        <h4 class="card-header">
                            訂單資訊
                        </h4>

                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <dl class="row">
                                        <dt class="col-4">
                                            訂單編號
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->no }}
                                        </dd>
                                        <dt class="col-4">
                                            訂單狀態
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->state->getTitle($lang) }}
                                        </dd>
                                        <dt class="col-4">
                                            付款方式
                                        </dt>
                                        <dd class="col-8">
                                            {{ $paymentTitle }}
                                        </dd>
                                    </dl>
                                </div>

                                <div class="col-md-6">
                                    <dl class="row">
                                        <dt class="col-4">
                                            購買時間
                                        </dt>
                                        <dd class="col-8">
                                            {{ $chronos->toLocalFormat($item->created, 'Y-m-d H:i:s') }}
                                        </dd>
                                        <dt class="col-4">
                                            發票編號
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->invoiceNo ?? '' }}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    @if($payment)
                        <div class="card">
                            <h4 class="card-header">
                                付款資訊
                            </h4>

                            <div class="card-body">
                                {!! $payment->orderInfo($item, $orderItems) !!}
                            </div>
                        </div>
                    @endif

                    <div class="card">
                        <h4 class="card-header">
                            訂單項目
                        </h4>

                        <div class="table-responsive">
                            <table class="table">
                                <tbody>
                                @foreach ($orderItems as $orderItem)
                                    <tr>
                                        <td>
                                            <img src="{{ $orderItem->image }}"
                                                width="150px"
                                                alt="{{ $orderItem->title }}"
                                            >
                                        </td>
                                        <td class="fw-bold">
                                            {{ $orderItem->title }}
                                        </td>
                                        <td class="text-end">
                                            {{ number_format($orderItem->total) }}
                                        </td>
                                    </tr>
                                @endforeach
                                </tbody>
                                <tfoot>
                                @foreach ($totals as $total)
                                    <tr>
                                        <td></td>
                                        <td class="text-end">
                                            {{ $total->title }}
                                        </td>
                                        <td class="text-end">
                                            {{ numberFormat($total->value) }}
                                        </td>
                                    </tr>
                                @endforeach
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div class="card std-card">
                        <h4 class="card-header">
                            發票資訊
                        </h4>

                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <dl class="row">
                                        <dt class="col-4">
                                            發票類型
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->invoiceType->getTitle($lang) }}
                                        </dd>
                                        @if($item->invoiceType === InvoiceType::COMPANY)
                                            <dt class="col-4">
                                                統一編號
                                            </dt>
                                            <dd class="col-8">
                                                {{ $item->invoiceData->vat }}
                                            </dd>
                                            <dt class="col-4">
                                                發票抬頭
                                            </dt>
                                            <dd class="col-8">
                                                {{ $item->invoiceData->title }}
                                            </dd>
                                        @endif
                                        <dt class="col-4">
                                            收件人
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->invoiceData->name }}
                                        </dd>
                                        <dt class="col-4">
                                            寄送地址
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->invoiceData->address }}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h4 class="card-header">
                            訂單歷史記錄
                        </h4>

                        <div class="table-responsive">
                            <table class="table">
                                <thead class="text-white font-weight-normal">
                                <tr class="text-secondary">
                                    <th class="text-nowrap">更新日期</th>
                                    <th class="text-nowrap">訂單狀態</th>
                                    <th class="text-nowrap">通知</th>
                                    <th class="text-nowrap">處理人員</th>
                                    <th class="text-nowrap">備註</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($histories as $history)
                                    <tr class="text-base">
                                        <td class="text-nowrap">
                                            {{ $chronos->toLocalFormat($history->created, 'Y-m-d H:i:s') }}
                                        </td>
                                        <td class="text-nowrap">
                                            <span
                                                class="order-state {{ $history->state->getColor() }} text-nowrap">
                                                {{ $history->state->getTitle($lang) }}
                                            </span>
                                        </td>
                                        <td class="text-nowrap">
                                            @if($history->notify)
                                                已通知
                                            @else
                                                未通知
                                            @endif
                                        </td>
                                        <td class="text-nowrap">
                                            {{ $history->type->getTitle($lang) }}
                                        </td>
                                        <td>
                                            {{ $history->message ?? '' }}
                                        </td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop
