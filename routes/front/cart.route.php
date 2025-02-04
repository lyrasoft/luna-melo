<?php

declare(strict_types=1);

namespace App\Routes;

use Lyrasoft\Melo\Module\Front\Cart\CartController;
use Lyrasoft\Melo\Module\Front\Cart\CartView;
use Windwalker\Core\Middleware\JsonApiMiddleware;
use Windwalker\Core\Router\RouteCreator;

/** @var  RouteCreator $router */

$router->any('cart', 'cart')
    ->controller(CartController::class)
    ->view(CartView::class);

$router->any('cart_ajax', 'cart/ajax[/{task}]')
    ->middleware(JsonApiMiddleware::class)
    ->controller(CartController::class, 'ajax');

$router->any('checkout', '/checkout')
    ->controller(CartController::class)
    ->postHandler('checkout');
