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
use Lyrasoft\Melo\Enum\InvoiceType;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $item MeloOrder
 */

$full ??= false;
?>
<div class="card std-card">
    <h4 class="card-header">
        發票資訊
    </h4>

    <div class="card-body">
        <div class="row">
            <div class="{{ $full ? 'col-12' : 'col-lg-6' }}">
                <dl class="row">
                    <dt class="col-4">
                        發票類型
                    </dt>
                    <dd class="col-8">
                        {{ $item->invoiceType->getTitle($lang) }}
                    </dd>
                    <dt class="col-4">
                        發票編號
                    </dt>
                    <dd class="col-8">
                        {{ $item->invoiceNo ?? '' }}
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
