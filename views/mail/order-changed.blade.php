<?php

declare(strict_types=1);

namespace App\view;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app       AppContext      Application context.
 * @var $vm        object          The view model object.
 * @var $uri       SystemUri       System Uri information.
 * @var $chronos   ChronosService  The chronos datetime service.
 * @var $nav       Navigator       Navigator object to build route.
 * @var $asset     AssetService    The Asset manage service.
 * @var $lang      LangService     The language translation service.
 */

use Lyrasoft\Melo\Entity\OrderHistory;
use Lyrasoft\Melo\MeloPackage;
use Lyrasoft\Melo\Entity\Order;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

use function Windwalker\str;

/**
 * @var $item    Order
 * @var $history OrderHistory
 */

$item = $order;
$melo = $app->service(MeloPackage::class);

?>

@extends('mail.mail-layout')

@section('content')
    <style>
        .c-order-state {
            padding: .25rem .5rem;
            border-radius: .25rem;
        }

        .text-primary {
            opacity: 1;
            color: #0d6efd;
        }

        .text-info {
            opacity: 1;
            color: #0dcaf0;
        }

        .text-danger {
            opacity: 1;
            color: #dc3545;
        }

        .text-secondary {
            opacity: 1;
            color: #6c757d;
        }

        .text-success {
            opacity: 1;
            color: #198754;
        }
    </style>

    <div style="margin-top: 40px">
        @if ($isAdmin)
            <h3>親愛的管理員您好</h3>
        @else
            <h3>親愛的{{ $melo->config('shop.sitename') }}會員您好</h3>
        @endif
    </div>


    <p>訂單 #{{ $item->no }} 的內容已變更:</p>

    <p>
        訂單編號：#{{ $item->no }}
    </p>
    <p>
        訂購時間：{{ $item->created->format('Y-m-d H:i:s') }}
    </p>

    <p>
        訂購狀態:
        <span class="c-order-state text-{{ $history->state->getColor() }}">
            {{ $history->state->getTitle($lang) }}
        </span>
    </p>

    <br />
    <br />

    <div style="margin-top: 40px">
        @if ($isAdmin)
            <a href="{{ $nav->to('admin::order_edit')->id($item->id)->full() }}"
                class="btn btn-primary"
                target="_blank"
                style="width: 100%"
            >
                觀看訂單內容
            </a>
        @else
            <a href="{{ $nav->to('front::order_item')->id($item->id)->full() }}"
                class="btn btn-primary"
                target="_blank"
                style="width: 100%"
            >
                觀看訂單內容
            </a>
        @endif
    </div>
@stop
