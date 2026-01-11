<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Question;

use Lyrasoft\Melo\Entity\Question;
use Lyrasoft\Melo\Repository\QuestionRepository;
use Unicorn\Attributes\Ajax;
use Unicorn\Controller\AjaxControllerTrait;
use Unicorn\Upload\FileUploadManager;
use Unicorn\Upload\FileUploadService;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\JsonApi;
use Windwalker\Core\Attributes\Method;
use Windwalker\Core\Attributes\Request\Input;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;

#[Controller()]
class QuestionController
{
    use AjaxControllerTrait;

    #[Ajax]
    #[Method('GET')]
    public function prepare(
        AppContext $app,
        #[Autowire] QuestionRepository $repository,
        #[Input] string $segmentId,
    ): Collection {
        return $repository->getListSelector()
            ->where('segment_id', (int) $segmentId)
            ->order('ordering', 'ASC')
            ->limit(0)
            ->all(Question::class);
    }

    #[Ajax]
    #[Method('POST')]
    public function reorder(
        AppContext $app,
        #[Autowire] QuestionRepository $repository,
    ): void {
        $orders = $app->input('orders');

        $repository->createReorderAction()->reorder($orders);
    }

    #[Ajax]
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

    #[Ajax]
    #[Method('POST')]
    public function delete(
        AppContext $app,
        ORM $orm
    ): void {
        $id = $app->input('id');

        $orm->deleteWhere(Question::class, ['id' => $id]);
    }
}
