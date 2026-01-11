<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Option;

use Lyrasoft\Melo\Entity\MeloOption;
use Lyrasoft\Melo\Repository\OptionRepository;
use Unicorn\Attributes\Ajax;
use Unicorn\Controller\AjaxControllerTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\JsonApi;
use Windwalker\Core\Attributes\Method;
use Windwalker\Core\Attributes\Request\Input;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

#[Controller()]
class OptionController
{
    use AjaxControllerTrait;

    #[Ajax]
    #[Method('GET')]
    public function prepare(
        AppContext $app,
        #[Autowire] OptionRepository $repository,
        #[Input] string $questionId,
    ): Collection {
        return $repository->getListSelector()
            ->where('question_id', (int) $questionId)
            ->order('ordering', 'ASC')
            ->limit(0)
            ->all(MeloOption::class);
    }

    #[Ajax]
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

    #[Ajax]
    #[Method('POST')]
    public function reorder(
        AppContext $app,
        #[Autowire] OptionRepository $repository,
    ): void {
        $orders = $app->input('orders');

        $repository->createReorderAction()->reorder($orders);
    }

    #[Ajax]
    #[Method('POST')]
    public function delete(
        AppContext $app,
        ORM $orm
    ): void {
        $id = $app->input('id');

        $orm->deleteWhere(MeloOption::class, ['id' => $id]);
    }

    #[Ajax]
    #[Method('POST')]
    public function saveMultiple(
        ORM $orm,
        #[Input] array $options = [],
    ): iterable {
        $options = array_map(
            fn ($option) => $orm->toEntity(MeloOption::class, $option),
            $options
        );

        return $orm->saveMultiple(MeloOption::class, $options);
    }
}
