<?php

declare(strict_types=1);

namespace App\View;

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

use Unicorn\Html\Breadcrumb;
use Unicorn\Legacy\Html\MenuHelper;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

$breadcrumbService = $app->service(Breadcrumb::class);
$menuHelper = $app->service(MenuHelper::class);
?>

@push('style')
    <style>
        .l-lesson-page-title {
            margin-bottom: 60px;
        }
    </style>
@endpush

<div class="l-lesson-page-title bg-primary text-white">
    <div class="container">
        <div class="row">
            <div class="col py-5">
                <h1 class="h2">{{ $title }}</h1>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        @foreach($breadcrumbService->getIterator() as $breadcrumb)
                            <li class="breadcrumb-item">
                                <a @attr('href', $breadcrumb['link'] === '' ? null : $breadcrumb['link'])>
                                    {{ $breadcrumb['title'] }}
                                </a>
                            </li>
                        @endforeach
                    </ol>
                </nav>
            </div>
        </div>
    </div>
</div>
