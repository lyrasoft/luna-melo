<?php

declare(strict_types=1);

namespace App\Routes;

use Lyrasoft\Melo\Module\Admin\MeloOrder\MeloOrderController;
use Lyrasoft\Melo\Module\Admin\MeloOrder\MeloOrderEditView;
use Lyrasoft\Melo\Module\Admin\MeloOrder\MeloOrderListView;
use Windwalker\Core\Router\RouteCreator;

/** @var  RouteCreator $router */

$router->group('order')
    ->extra('menu', ['sidemenu' => 'order_list'])
    ->register(function (RouteCreator $router) {
        $router->any('melo_order_list', '/melo/order/list')
            ->controller(MeloOrderController::class)
            ->view(MeloOrderListView::class)
            ->postHandler('copy')
            ->putHandler('filter')
            ->patchHandler('batch');

        $router->any('melo_order_edit', '/melo/order/edit[/{id}]')
            ->controller(MeloOrderController::class)
            ->view(MeloOrderEditView::class);
    });
