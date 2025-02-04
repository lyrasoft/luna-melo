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

use Lyrasoft\Melo\Module\Front\Cart\CartView;
use Lyrasoft\Luna\User\UserService;
use Unicorn\Script\UnicornScript;
use Unicorn\Script\VueScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

$userService = $app->service(UserService::class);
$vueScript = $app->service(VueScript::class);
$vueScript->vue();
$vueScript->animate();

$uniScript = $app->service(UnicornScript::class);
$uniScript->data('cart.props', [
    'user' => $userService->isLogin() ? $userService->getUser() : null,
]);

$uniScript->addRoute('@cart_ajax');
$uniScript->addRoute('checkoutLink', $nav->to('checkout'));
$uniScript->addRoute('search', $nav->to('lesson_list'));
?>

@extends('global.body')

@section('content')
    <div class="l-cart-page container my-5">
        <cart-app v-cloak>
            <form id="checkout-form" action="{{ $nav->to('checkout') }}"
                method="POST" enctype="multipart/form-data">
                <div class="row">
                    <div class="col-md-8">
                        <div class="card mb-5">
                            <div class="card-body">
                                <h4 class="text-secondary mb-0">
                                    購物車
                                </h4>
                                <div v-if="!cartStore?.count" class="position-relative c-cart-card__invalid">
                                    <div class="c-cart-card__invalid-text text-center">
                                        <div class="mb-4">
                                            您的購物車是空的，來去逛逛！
                                        </div>

                                        <a :href="lessonLink" class="btn btn-lg btn-primary h-btn px-4">
                                            探索課程
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div v-if="cartStore?.count" class="table-responsive bg-light">
                                <x-cart-items></x-cart-items>
                            </div>
                        </div>

                        <div class="card mb-5">
                            <div class="card-body border-bottom">
                                <h4 class="text-secondary m-0">
                                    電子發票開立資訊
                                </h4>
                            </div>

                            <div class="card-body">
                                <div class="mb-3">
                                    以下資訊只用於開立發票，並不會在其他頁面顯示。發票一經開立後不可更改，請確認資訊是否都填寫正確喔！
                                </div>

                                <div class="row">
                                    <x-field :field="$form['invoice_vat']" class="mb-4"></x-field>

                                    <x-field :field="$form['invoice_title']" class="mb-4"></x-field>

                                    <x-field :field="$form['invoice_name']" class="mb-4"></x-field>

                                    <x-field :field="$form['invoice_carrier']" class="mb-4"></x-field>
                                </div>

                                <x-field :field="$form['address_row']" class="mb-4"></x-field>

                                <x-field :field="$form['address']" class="mb-4"></x-field>
                            </div>
                        </div>

                        <div class="card mb-5 mb-md-0">
                            <div class="card-body border-bottom">
                                <h4 class="text-secondary m-0">
                                    付款方式
                                </h4>
                            </div>

                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-7">
                                        <x-field :field="$form['payment']" class="mb-4"></x-field>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card std-card c-cart-card">
                            <div class="card-body border-bottom">
                                <h4 class="text-secondary m-0">
                                    訂單明細
                                </h4>
                            </div>
                            <div class="card-body">
                                <div v-if="cartStore?.count" class="d-flex justify-content-between mb-2">
                                    <div class="text-base">
                                        總計
                                    </div>
                                    <h5 class="text-base m-0">
                                        @{{ cartStore?.count }} 堂課
                                    </h5>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <div class="text-base">
                                        小計
                                    </div>
                                    <h5 class="text-base m-0">
                                        @{{ formatPrice(cartStore?.totals?.lesson_total?.price) }}
                                    </h5>
                                </div>
                                <div class="text-end mb-3">
                                    <h3 class="text-primary">
                                        @{{ formatPrice(cartStore?.totals?.grand_total?.price) }}
                                    </h3>
                                </div>
                                <div class="d-grid gap-2">
                                    <button type="submit" class="btn disable-on-submit"
                                        :class="cartStore?.count ? 'btn-primary' : 'btn-outline-base disabled'"
                                    >
                                        確定結賬
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <x-csrf></x-csrf>
            </form>
        </cart-app>
    </div>
@stop
