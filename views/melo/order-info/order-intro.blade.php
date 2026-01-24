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

$paymentComposer = $app->retrieve(PaymentComposer::class);
$payment = $paymentComposer->getGateway($item->payment);
$paymentTitle = $item->paymentData->paymentTitle ?: $payment?->getTitle($this->lang);
?>
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
                        付款時間
                    </dt>
                    <dd class="col-8">
                        {{ $chronos->toLocalFormat($item->paidAt, 'Y-m-d H:i:s') }}
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</div>
