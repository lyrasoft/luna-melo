<?php

declare(strict_types=1);

namespace App\View;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var  $app       AppContext      Application context.
 * @var  $vm        LessonCartView  The view model object.
 * @var  $uri       SystemUri       System Uri information.
 * @var  $chronos   ChronosService  The chronos datetime service.
 * @var  $nav       Navigator       Navigator object to build route.
 * @var  $asset     AssetService    The Asset manage service.
 * @var  $lang      LangService     The language translation service.
 */

use Lyrasoft\Melo\Module\Front\LessonCart\LessonCartView;
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

$uniScript->addRoute('@cart_ajax', $nav->to('melo_cart_ajax'));
$uniScript->addRoute('checkoutLink', $nav->to('melo_checkout'));
$uniScript->addRoute('search', $nav->to('lesson_list'));
?>

@extends('global.body')

@section('content')
    <div class="l-cart-page container my-5">
        <cart-app></cart-app>
    </div>
@stop
