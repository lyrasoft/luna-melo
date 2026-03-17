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
        <p>銀行代碼: <span class="fs-5 fw-bold">{{ $info->BankCode }}</span></p>
        <p>ATM 匯款帳戶: <span class="fs-5 fw-bold">{{ $info->vAccount }}</span></p>
        <p>到期時間: {{ $info->ExpireDate }}</p>
    </div>
@endif
@if ($payment->type === EcpayPaymentType::CVS)
    <div>
        <p>
            請至超商多媒體機台輸入代碼，產生繳費單後前往櫃台繳費。
            (<a href="https://support.ecpay.com.tw/4920/" target="_blank">
                繳費流程說明
            </a>)
        </p>
        <p class="text-muted">(適用 7-11/全家/萊爾富/OKmart 超商)</p>
        <p class="fs-4 fw-bold">{{ $info->PaymentNo }}</p>
        <p>到期時間: {{ $info->ExpireDate }}</p>

        <p>
            <a href="{{ $payment->getEndpoint('PaymentRule/CVSBarCode') }}?PaymentNo={{ $info->PaymentNo }}"
                class="btn btn-primary btn-sm"
                target="_blank"
            >
                顯示繳費條碼
            </a>
            <button type="button"
                data-link={{ $payment->getEndpoint('PaymentRule/CVSBarCode') }}?PaymentNo={{ $info->PaymentNo }}"
                class="btn btn-outline-primary btn-sm"
                onclick="navigator.clipboard.writeText(this.dataset.link).then(() => { alert('繳費連結已複製'); })"
            >
                複製繳費連結
            </button>
        </p>
    </div>
@endif
{{-- 其他類型尚未完成 --}}
