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

use Unicorn\Html\Breadcrumb;
use Lyrasoft\Melo\Entity\Order;
use Lyrasoft\Melo\Entity\OrderHistory;
use Lyrasoft\Melo\Entity\OrderItem;
use Lyrasoft\Melo\Enum\InvoiceType;
use Lyrasoft\Melo\Enum\OrderState;
use Lyrasoft\Melo\Enum\Payment;
use Lyrasoft\Melo\Module\Front\Order\OrderItemView;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $item      Order
 * @var $history   OrderHistory
 * @var $orderItem OrderItem
 */

$breadcrumb = $app->service(Breadcrumb::class);

$breadcrumb->push($lang->trans('melo.order.item.page.title'));
?>

@extends('global.body')

@section('content')
    @include('melo.front.page-title', ['title' => $lang->trans('melo.order.item.page.title')])

    <div class="l-order">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 d-none d-lg-block">
                    @include('melo.front.profile-sidebar', ['info' => $userInfo])
                </div>

                <div class="col-lg-9">
                    <div class="card mb-4">
                        <div class="card-body border-bottom">
                            <h4 class="text-secondary mb-0">
                                訂單資訊
                            </h4>
                        </div>

                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <dl class="row">
                                        <dt class="col-4">
                                            訂單編號
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->getNo() }}
                                        </dd>
                                        <dt class="col-4">
                                            訂單狀態
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->getState()->getTitle($lang) }}
                                        </dd>
                                        <dt class="col-4">
                                            付款方式
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->getPayment()->getTitle($lang) }}
                                        </dd>
                                    </dl>
                                </div>

                                <div class="col-md-6">
                                    <dl class="row">
                                        <dt class="col-4">
                                            購買時間
                                        </dt>
                                        <dd class="col-8">
                                            {{ $chronos->toLocalFormat($item->getCreated(), 'Y-m-d H:i:s') }}
                                        </dd>
                                        <dt class="col-4">
                                            發票編號
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->getInvoiceNo() ?? '' }}
                                        </dd>
                                    </dl>
                                </div>

                                @if($item->getPayment() === Payment::ATM && $item->getState() === OrderState::PENDING)
                                    <div class="col-md-6">
                                        <dt class="mb-2">
                                            付款資訊
                                        </dt>

                                        <dl class="row">
                                            <dt class="col-4">
                                                銀行代碼
                                            </dt>
                                            <dd class="col-8">
                                                {{ $item->getPaymentData()['bank_code'] ?? '' }}
                                            </dd>
                                            <dt class="col-4">
                                                銀行帳號
                                            </dt>
                                            <dd class="col-8">
                                                {{ $item->getPaymentData()['bank_account'] ?? '' }}
                                            </dd>
                                            <dt class="col-4">
                                                付款期限
                                            </dt>
                                            <dd class="col-8">
                                                {{ $chronos->toLocalFormat($item->getExpiredOn(), 'Y-m-d') }}
                                            </dd>
                                        </dl>
                                    </div>
                                @endif

                                <div class="col-12">
                                    <dt>
                                        課程
                                    </dt>

                                    <div class="table-responsive">
                                        <table class="table">
                                            <tbody>
                                            @foreach ($orderItems as $orderItem)
                                                <tr>
                                                    <td>
                                                        <img src="{{ $orderItem->getImage() }}"
                                                            width="150px"
                                                            alt="{{ $orderItem->getTitle() }}"
                                                        >
                                                    </td>
                                                    <td class="fw-bold">
                                                        {{ $orderItem->getTitle() }}
                                                    </td>
                                                    <td class="text-end">
                                                        {{ number_format($orderItem->getTotal()) }}
                                                    </td>
                                                </tr>
                                            @endforeach
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td></td>
                                                <td class="text-end">總計 :</td>
                                                <td class="text-end">
                                                    {{ number_format($item->getTotal()) }}
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card std-card mb-4">
                        <div class="card-body border-bottom">
                            <h4 class="text-secondary mb-0">發票資訊</h4>
                        </div>

                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <dl class="row">
                                        <dt class="col-4">
                                            發票類型
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->getInvoiceType()->getTitle($lang) }}
                                        </dd>
                                        @if($item->getInvoiceType() === InvoiceType::COMPANY)
                                            <dt class="col-4">
                                                統一編號
                                            </dt>
                                            <dd class="col-8">
                                                {{ $item->getInvoiceData()['invoice_vat'] ?? '' }}
                                            </dd>
                                            <dt class="col-4">
                                                發票抬頭
                                            </dt>
                                            <dd class="col-8">
                                                {{ $item->getInvoiceData()['invoice_title'] ?? '' }}
                                            </dd>
                                        @endif
                                        <dt class="col-4">
                                            收件人
                                        </dt>
                                        <dd class="col-8">
                                            {{ $item->getInvoiceData()['invoice_name'] ?? '' }}
                                        </dd>
                                        <dt class="col-4">
                                            寄送地址
                                        </dt>
                                        <dd class="col-8">
                                            {{ implode('', $item->getInvoiceData()['address'] ?? []) }}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-4">
                        <div class="card-body">
                            <h4 class="text-secondary mb-0">訂單歷史訊息</h4>
                        </div>

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
                                            {{ $chronos->toLocalFormat($history->getCreated(), 'Y-m-d H:i:s') }}
                                        </td>
                                        <td class="text-nowrap">
                                            <span
                                                class="order-state {{ $history->getState()->getColor() }} text-nowrap">
                                                {{ $history->getState()->getTitle($lang) }}
                                            </span>
                                        </td>
                                        <td class="text-nowrap">
                                            @if($history->isNotify())
                                                已通知
                                            @else
                                                未通知
                                            @endif
                                        </td>
                                        <td class="text-nowrap">
                                            {{ $history->getType()->getTitle($lang) }}
                                        </td>
                                        <td>
                                            {{ $history->getMessage() ?? '' }}
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
