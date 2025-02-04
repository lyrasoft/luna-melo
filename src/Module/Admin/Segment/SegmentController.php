<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Segment;

use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Repository\SegmentRepository;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\JsonApi;
use Windwalker\Core\Attributes\Method;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

#[Controller()]
class SegmentController
{
    #[JsonApi]
    public function ajax(AppContext $app): mixed
    {
        $task = $app->input('task');

        return $app->call([$this, $task]);
    }

    #[Method('POST')]
    public function save(
        AppContext $app,
        ORM $orm,
    ): object {
        $data = $app->input('data');
        $isNew = (int) $app->input('isNew');

        if ($isNew === 1) {
            return $orm->createOne(Segment::class, $data);
        }

        return $orm->saveOne(Segment::class, $data);
    }

    #[Method('POST')]
    public function delete(
        AppContext $app,
        ORM $orm,
    ): void {
        $segmentId = $app->input('id');

        $orm->deleteWhere(Segment::class, ['id' => $segmentId]);
    }

    #[Method('GET')]
    public function prepareSegments(
        AppContext $app,
        #[Autowire] SegmentRepository $repository,
    ): \Windwalker\Data\Collection {
        $lessonId = $app->input('lesson_id');
        $parentId = $app->input('parent_id') ?? 0;

        return $repository->getListSelector()
            ->where('lesson_id', (int) $lessonId)
            ->where('parent_id', (int) $parentId)
            ->order('ordering', 'ASC')
            ->limit(0)
            ->all(Segment::class);
    }

    #[Method('POST')]
    public function reorder(
        AppContext $app,
        #[Autowire] SegmentRepository $repository,
    ): void {
        $orders = $app->input('orders');

        $repository->createReorderAction()->reorder($orders);
    }
}
