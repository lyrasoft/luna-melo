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

use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Features\Payment\PaymentComposer;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $item MeloOrder
 */

$userService = $app->retrieve(UserService::class);
$paymentComposer = $app->retrieve(PaymentComposer::class);
$payment = $paymentComposer->getGateway($item->payment);
$paymentTitle = $item->paymentData->paymentTitle ?: $payment?->getTitle($this->lang);

$purchaseUser = $userService->load($item->userId);
?>
<div class="card">
    <div class="card-header d-flex align-items-center justify-content-between gap-2">
        <h4 class="m-0">
            訂單資訊
        </h4>

        <div>
            {!! $toolbar ?? '' !!}
        </div>
    </div>

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
                        購買人
                    </dt>
                    <dd class="col-8">
                        {{ $item->invoiceData->name }}
                    </dd>

                    @if ($purchaseUser)
                        <dt class="col-4">
                            會員
                        </dt>
                        <dd class="col-8">
                            <a href="{{ $nav->to('user_edit')->id($purchaseUser->id) }}" target="_blank">
                                {{ $purchaseUser->name }}

                                <i class="far fa-external-link"></i>
                            </a>
                        </dd>
                    @endif

                </dl>
            </div>

            <div class="col-md-6">
                <dl class="row">
                    <dt class="col-4">
                        付款方式
                    </dt>
                    <dd class="col-8">
                        {{ $paymentTitle }}
                    </dd>
                    <dt class="col-4">
                        購買時間
                    </dt>
                    <dd class="col-8">
                        {{ $chronos->toLocalFormat($item->created, 'Y-m-d H:i:s') }}
                    </dd>
                    <dt class="col-4">
                        付款編號
                    </dt>
                    <dd class="col-8">
                        {{ $item->paymentNo }}
                    </dd>
                    <dt class="col-4">
                        付款時間
                    </dt>
                    <dd class="col-8">
                        {{ $chronos->toLocalFormat($item->paidAt, 'Y-m-d H:i:s') ?: '-' }}
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</div>
