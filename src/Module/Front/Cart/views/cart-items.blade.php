<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        CartView  The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use App\Module\Front\Cart\CartView;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

$asset->js('vendor/lyrasoft/melo/dist/lesson.js');
?>

<table class="l-cart-items table">
    <thead class="bg-light">
    <tr class="b">
        <th width="5%" class="text-center text-nowrap border-0">
            編號
        </th>
        <th class=" text-nowrap border-0">
            課程名稱
        </th>
        <th class="text-center text-nowrap border-0">
            售價
        </th>
        <th width="5%" class="text-center text-nowrap border-0">
            刪除
        </th>
    </tr>
    </thead>
    <tbody class="bg-white">
    <tr v-for="(item, i) of cartStore?.items" :key="item.uid" :i="i">
        <td class="text-center align-middle text-nowrap border-0">
            @{{ i + 1 }}
        </td>
        <td class="border-0">
            <div class="d-flex align-items-center">
                <img :src="item.image" alt="Image" class="me-2" width="100px">
                <span style="min-width: 150px">
                    @{{ item.title }}
                </span>
            </div>
        </td>
        <td class="text-nowrap text-center border-0 align-middle">
            @{{ formatPrice(item?.prices?.final?.price) }}
        </td>
        <td class="text-center text-nowrap border-0 align-middle">
            <a href="javascript://" @click.prevent="deleteItem(i)">
                <i class="fas fa-trash fa-fw"></i>
            </a>
        </td>
    </tr>
    </tbody>
</table>

