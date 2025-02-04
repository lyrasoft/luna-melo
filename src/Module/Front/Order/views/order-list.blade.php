<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        OrderListView  The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use Lyrasoft\Melo\Entity\Order;
use Lyrasoft\Melo\Module\Front\Order\OrderListView;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Pagination\Pagination;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $item       Order
 * @var $pagination Pagination
 */

?>

@extends('global.body')

@section('content')
    @include('melo.front.page-title', ['title' => '訂單列表'])

    <div class="l-my-order-list">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 d-none d-lg-block">
                    @include('melo.front.profile-sidebar', ['info' => $userInfo])
                </div>

                <div class="col col-lg-9">
                    <div class="mb-5">
                        <div class="row">
                            <div class="card">
                                <div class="card-body border-bottom">
                                    <h4 class="text-secondary mb-0">訂單資訊</h4>
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-borderless">
                                        <thead class="fw-normal">
                                        <tr>
                                            <th class="text-nowrap text-center">
                                                訂單資訊
                                            </th>
                                            <th>
                                                編號
                                            </th>
                                            <th class="text-nowrap">
                                                訂單狀態
                                            </th>
                                            <th class="text-nowrap">
                                                付款方式
                                            </th>
                                            <th class="text-nowrap">
                                                購買日期
                                            </th>
                                            <th class="text-nowrap">
                                                購買金額
                                            </th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        @foreach($items as $item)
                                            <tr>
                                                <td class="align-middle text-center">
                                                    <a href="{{ $nav->to('order_item', ['id' => $item->getId()]) }}">
                                                        <i class="fal fa-file-alt fa-2x"></i>
                                                    </a>
                                                </td>

                                                <td class="align-middle">
                                                    {{ $item->getNo() }}
                                                </td>

                                                <td class="align-middle">
                                                    <span class="order-state text-{{ $item->getState()->getColor() }} text-nowrap">
                                                        {{ $item->getState()->getTitle($lang) }}
                                                    </span>
                                                </td>

                                                <td class="align-middle">
                                                    {{ $item->getPayment()->getTitle($lang) }}
                                                </td>

                                                <td class="align-middle">
                                                    {{ $chronos->toLocalFormat($item->getCreated(), 'Y-m-d') }}
                                                </td>

                                                <td class="text-light-danger align-middle">
                                                    NT${{ number_format($item->getTotal()) }}
                                                </td>
                                            </tr>
                                        @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="c-pagination-content">
                        <div class="d-flex justify-content-center">
                            {!! $pagination->render() !!}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop
