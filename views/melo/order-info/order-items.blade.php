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

use Lyrasoft\Melo\Cart\Price\PriceObject;
use Lyrasoft\Melo\Cart\Price\PriceSet;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Features\Currency\CurrencyFormatter;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

use function Lyrasoft\Melo\numberFormat;

/**
 * @var $orderItems MeloOrderItem[]
 * @var $totals     PriceSet|PriceObject[]
 * @var $total      PriceObject
 * @var $grandTotal PriceObject
 */

$simple ??= false;

$totals = clone $totals;
$currency = $app->retrieve(CurrencyFormatter::class);

?>

<div class="card">
    <h4 class="card-header">
        訂單項目
    </h4>

    <div class="table-responsive">
        <table class="table">
            <tbody>
            @foreach ($orderItems as $orderItem)
                <tr>
                    <td style="width: 10%">
                        <img src="{{ $orderItem->image }}"
                            width="150px"
                            alt="{{ $orderItem->title }}"
                        >
                    </td>
                    <td class="fw-bold">
                        {{ $orderItem->title }}
                    </td>
                    <td class="text-end">
                        {{ $currency->short($orderItem->total) }}
                    </td>
                </tr>
            @endforeach
            </tbody>
            <tfoot>
            @foreach ($totals as $total)
                <tr>
                    <td></td>
                    <td class="text-end">
                        {{ $total->label }}
                    </td>
                    <td class="text-end">
                        {{ $currency->full($total->price) }}
                    </td>
                </tr>
            @endforeach
            </tfoot>
        </table>
    </div>
</div>
