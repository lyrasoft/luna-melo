<?php

declare(strict_types=1);

namespace App\Routes;

use Lyrasoft\Melo\Module\Front\MyOrder\MyOrderController;
use Lyrasoft\Melo\Module\Front\MyOrder\MyOrderItemView;
use Lyrasoft\Melo\Module\Front\MyOrder\MyOrderListView;
use Windwalker\Core\Router\RouteCreator;

/** @var  RouteCreator $router */

$router->group('melo_my_order')
    ->register(function (RouteCreator $router) {
        $router->any('melo_my_order_list', '/my/lesson/order/list')
            ->controller(MyOrderController::class)
            ->view(MyOrderListView::class)
            ->postHandler('copy')
            ->putHandler('filter')
            ->patchHandler('batch');

        $router->any('melo_my_order_item', '/my/lesson/order[/{no}]')
            ->controller(MyOrderController::class)
            ->view(MyOrderItemView::class);
    });
