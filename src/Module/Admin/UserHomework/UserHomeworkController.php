<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\UserHomework;

use Lyrasoft\Melo\Repository\UserSegmentMapRepository;
use Unicorn\Controller\CrudController;
use Unicorn\Controller\GridController;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Router\Navigator;
use Windwalker\DI\Attributes\Autowire;

#[Controller()]
class UserHomeworkController
{
    public function save(
        AppContext $app,
        CrudController $controller,
        Navigator $nav,
        #[Autowire] UserSegmentMapRepository $repository,
    ): mixed {
        $uri = $app->call($controller->saveWithNamespace(...), compact('repository'));

        return match ($app->input('task')) {
            'save2close' => $nav->to('user_homework_list'),
            default => $uri,
        };
    }

    public function delete(
        AppContext $app,
        #[Autowire] UserSegmentMapRepository $repository,
        CrudController $controller
    ): mixed {
        return $app->call($controller->delete(...), compact('repository'));
    }

    public function filter(
        AppContext $app,
        #[Autowire] UserSegmentMapRepository $repository,
        GridController $controller
    ): mixed {
        return $app->call($controller->filter(...), compact('repository'));
    }

    public function batch(
        AppContext $app,
        #[Autowire] UserSegmentMapRepository $repository,
        GridController $controller
    ): mixed {
        $task = $app->input('task');
        $data = match ($task) {
            'publish' => ['state' => 1],
            'unpublish' => ['state' => 0],
            default => null
        };

        return $app->call($controller->batch(...), compact('repository', 'data'));
    }

    public function copy(
        AppContext $app,
        #[Autowire] UserSegmentMapRepository $repository,
        GridController $controller
    ): mixed {
        return $app->call($controller->copy(...), compact('repository'));
    }
}
