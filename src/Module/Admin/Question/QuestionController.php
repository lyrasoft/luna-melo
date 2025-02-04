<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Question;

use Lyrasoft\Melo\Entity\Question;
use Lyrasoft\Melo\Repository\QuestionRepository;
use Unicorn\Upload\FileUploadManager;
use Unicorn\Upload\FileUploadService;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\JsonApi;
use Windwalker\Core\Attributes\Method;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;

#[Controller()]
class QuestionController
{
    #[JsonApi]
    public function ajax(AppContext $app): mixed
    {
        $task = $app->input('task');

        return $app->call([$this, $task]);
    }

    #[Method('GET')]
    public function prepareQuestions(
        AppContext $app,
        #[Autowire] QuestionRepository $repository,
    ): \Windwalker\Data\Collection {
        $segmentId = $app->input('segment_id');

        return $repository->getListSelector()
            ->where('segment_id', (int) $segmentId)
            ->order('ordering', 'ASC')
            ->limit(0)
            ->all(Question::class);
    }

    #[Method('POST')]
    public function reorder(
        AppContext $app,
        #[Autowire] QuestionRepository $repository,
    ): void {
        $orders = $app->input('orders');

        $repository->createReorderAction()->reorder($orders);
    }

    #[Method('POST')]
    public function save(
        AppContext $app,
        ORM $orm
    ): object {
        $data = $app->input('data');
        $isNew = (int) $app->input('is_new');

        if ($isNew === 1) {
            return $orm->createOne(Question::class, $data);
        }

        return $orm->saveOne(Question::class, $data);
    }

    #[Method('POST')]
    public function delete(
        AppContext $app,
        ORM $orm
    ): void {
        $id = $app->input('id');

        $orm->deleteWhere(Question::class, ['id' => $id]);
    }
}
