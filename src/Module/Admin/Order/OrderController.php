<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Order;

use Lyrasoft\Melo\Enum\OrderHistoryType;
use Lyrasoft\Melo\Enum\OrderState;
use Lyrasoft\Melo\Features\OrderService;
use Lyrasoft\Melo\Module\Admin\Order\Form\EditForm;
use Lyrasoft\Melo\Repository\MeloOrderRepository;
use Unicorn\Controller\CrudController;
use Unicorn\Controller\GridController;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\Filter;
use Windwalker\Core\Attributes\Request\Input;
use Windwalker\Core\Router\Navigator;
use Windwalker\DI\Attributes\Autowire;

#[Controller()]
class OrderController
{
    public function save(
        AppContext $app,
        CrudController $controller,
        Navigator $nav,
        #[Autowire] MeloOrderRepository $repository,
    ): mixed {
        $form = $app->make(EditForm::class);

        $uri = $app->call($controller->saveWithNamespace(...), compact('repository', 'form'));

        return match ($app->input('task')) {
            'save2close' => $nav->to('melo_order_list'),
            default => $uri,
        };
    }

    public function delete(
        AppContext $app,
        #[Autowire] MeloOrderRepository $repository,
        CrudController $controller
    ): mixed {
        return $app->call([$controller, 'delete'], compact('repository'));
    }

    public function filter(
        AppContext $app,
        #[Autowire] MeloOrderRepository $repository,
        GridController $controller
    ): mixed {
        return $app->call([$controller, 'filter'], compact('repository'));
    }

    public function batch(
        AppContext $app,
        #[Autowire] MeloOrderRepository $repository,
        GridController $controller
    ): mixed {
        $task = $app->input('task');

        if ($task === 'transition') {
            return $app->call($this->transition(...));
        }

        $data = match ($task) {
            'publish' => ['state' => 1],
            'unpublish' => ['state' => 0],
            default => null
        };

        return $app->call([$controller, 'batch'], compact('repository', 'data'));
    }

    public function transition(
        OrderService $orderService,
        Navigator $nav,
        #[Input, Filter('int')] int $id,
        #[Input] string $state,
        #[Input] string $message,
        #[Input, Filter('bool')] ?bool $notify = null,
    ) : mixed {
        $state = $state ? OrderState::wrap($state) : null;

        $orderService->changeState(
            $id,
            $state,
            OrderHistoryType::ADMIN,
            $message,
            (bool) $notify
        );

        return $nav->back();
    }

    public function copy(
        AppContext $app,
        #[Autowire] MeloOrderRepository $repository,
        GridController $controller
    ): mixed {
        return $app->call([$controller, 'copy'], compact('repository'));
    }
}
