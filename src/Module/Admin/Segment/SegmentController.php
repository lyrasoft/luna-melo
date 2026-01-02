<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Segment;

use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Repository\SegmentRepository;
use Unicorn\Attributes\Ajax;
use Unicorn\Controller\AjaxControllerTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\Filter;
use Windwalker\Core\Attributes\JsonApi;
use Windwalker\Core\Attributes\Method;
use Windwalker\Core\Attributes\Request\Input;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\DI\Attributes\Inject;
use Windwalker\ORM\ORM;

#[Controller()]
class SegmentController
{
    use AjaxControllerTrait;

    #[Ajax]
    #[Method('POST')]
    public function save(
        ORM $orm,
        #[Input] array $item,
    ): object {
        return $orm->saveOne(Segment::class, $item);
    }

    #[Ajax]
    #[Method('POST')]
    public function delete(
        AppContext $app,
        ORM $orm,
        #[Input, Filter('int')] int $id,
    ): void {
        $orm->deleteBatch(Segment::class, ['id' => $id]);
    }

    #[Ajax]
    #[Method('GET')]
    public function prepareSegments(
        #[Autowire] SegmentRepository $repository,
        #[Input, Filter('int')] int $lessonId,
        #[Input, Filter('int')] int $parentId = 0,
    ): Collection {
        return $repository->getListSelector()
            ->where('lesson_id', $lessonId)
            ->where('parent_id', $parentId)
            ->order('ordering', 'ASC')
            ->all(Segment::class);
    }

    #[Ajax]
    #[Method('POST')]
    public function reorder(
        AppContext $app,
        #[Autowire] SegmentRepository $repository,
    ): void {
        $orders = $app->input('orders');

        $repository->createReorderAction()->reorder($orders);
    }
}
