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

use Lyrasoft\Melo\Data\EcpayPaymentInfo;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Enum\EcpayPaymentType;
use Lyrasoft\Melo\Features\Payment\EcpayPayment;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;

use Windwalker\Core\Router\SystemUri;

/**
 * @var $order   MeloOrder
 * @var $items   MeloOrderItem[]
 * @var $payment EcpayPayment
 */

$info = $order->paymentData->info;

$info = EcpayPaymentInfo::wrap($info);

?>
@if ($payment->type === EcpayPaymentType::ATM)
    <div>
        <p>ATM 匯款帳戶: ({{ $info->BankCode }}) {{ $info->vAccount }}</p>
        <p>到期時間: {{ $info->ExpireDate }}</p>
    </div>
@endif
{{-- 其他類型尚未完成 --}}
