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
                    <x-melo.order-info.order-intro :item="$item"></x-melo.order-info.order-intro>

                    @php($orderInfo = $payment?->orderInfo($item, $orderItems))
                    @if(trim((string) $orderInfo))
                        <div class="card">
                            <h4 class="card-header">
                                付款資訊
                            </h4>

                            <div class="card-body">
                                {!! $orderInfo !!}
                            </div>
                        </div>
                    @endif

                    <x-melo.order-info.invoice-info :item="$item" />

                    <x-melo.order-info.order-items :item="$item" :totals="$totals" :order-items="$orderItems" />

                    <div class="card">
                        <h4 class="card-header">
                            訂單歷史記錄
                        </h4>

                        <div class="table-responsive">
                            <table class="table">
                                <thead class="text-white font-weight-normal">
                                <tr class="text-secondary">
                                    <th class="text-nowrap" style="width: 10%">更新日期</th>
                                    <th class="text-nowrap" style="width: 10%">訂單狀態</th>
                                    {{--<th class="text-nowrap">通知</th>--}}
                                    <th class="text-nowrap" style="width: 10%">處理人員</th>
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
                                            @if ($history->state)
                                            <span
                                                class="order-state {{ $history->state->getColor() }} text-nowrap">
                                                {{ $history->state->getTitle($lang) }}
                                            </span>
                                            @endif
                                        </td>
                                        {{--<td class="text-nowrap">--}}
                                        {{--    @if($history->notify)--}}
                                        {{--        已通知--}}
                                        {{--    @else--}}
                                        {{--        未通知--}}
                                        {{--    @endif--}}
                                        {{--</td>--}}
                                        <td class="text-nowrap">
                                            {{ $history->type->getTitle($lang) }}
                                        </td>
                                        <td>
                                            {!! html_escape($history->message, true) !!}
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
