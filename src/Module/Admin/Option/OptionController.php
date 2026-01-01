<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Option;

use Lyrasoft\Melo\Entity\MeloOption;
use Lyrasoft\Melo\Repository\OptionRepository;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\JsonApi;
use Windwalker\Core\Attributes\Method;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

#[Controller()]
class OptionController
{
    #[JsonApi]
    public function ajax(AppContext $app): mixed
    {
        $task = $app->input('task');

        return $app->call([$this, $task]);
    }

    #[Method('GET')]
    public function prepareOptions(
        AppContext $app,
        #[Autowire] OptionRepository $repository,
    ): \Windwalker\Data\Collection {
        $questionId = $app->input('question_id');

        return $repository->getListSelector()
            ->where('question_id', (int) $questionId)
            ->order('ordering', 'ASC')
            ->limit(0)
            ->all(MeloOption::class);
    }

    #[Method('POST')]
    public function save(
        AppContext $app,
        ORM $orm,
    ): object {
        $data = $app->input('data');
        $isNew = (int) $app->input('is_new');

        if ($isNew === 1) {
            return $orm->createOne(MeloOption::class, $data);
        }

        return $orm->saveOne(MeloOption::class, $data);
    }

    #[Method('POST')]
    public function reorder(
        AppContext $app,
        #[Autowire] OptionRepository $repository,
    ): void {
        $orders = $app->input('orders');

        $repository->createReorderAction()->reorder($orders);
    }

    #[Method('POST')]
    public function delete(
        AppContext $app,
        ORM $orm
    ): void {
        $id = $app->input('id');

        $orm->deleteWhere(MeloOption::class, ['id' => $id]);
    }

    #[Method('POST')]
    public function saveOptions(
        AppContext $app,
        ORM $orm,
    ): iterable {
        $data = $app->input('data');

        return $orm->saveMultiple(MeloOption::class, $data);
    }
}
