<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Lesson;

use Lyrasoft\Luna\Services\TagService;
use Lyrasoft\Melo\Entity\LessonCategoryMap;
use Lyrasoft\Melo\Features\Lesson\LessonDispatcher;
use Lyrasoft\Melo\Features\LessonService;
use Lyrasoft\Melo\Module\Admin\Lesson\Form\EditForm;
use Lyrasoft\Melo\Repository\LessonRepository;
use Lyrasoft\Attachment\Entity\Attachment;
use Unicorn\Controller\CrudController;
use Unicorn\Controller\GridController;
use Unicorn\Upload\FileUploadManager;
use Unicorn\Upload\FileUploadService;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\Request\Input;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\Event\AfterSaveEvent;
use Windwalker\ORM\ORM;

#[Controller()]
class LessonController
{
    public function save(
        AppContext $app,
        CrudController $controller,
        Navigator $nav,
        #[Autowire] LessonRepository $repository,
        #[Inject(tag: 'image')]
        FileUploadService $fileUploadService,
        ORM $orm,
        TagService $tagService,
    ): mixed {
        $form = $app->make(EditForm::class);

        $controller->afterSave(
            function (AfterSaveEvent $event) use ($tagService, $fileUploadService, $repository, $app, $orm) {
                $data = $event->data;

                $data['image'] = $fileUploadService->handleFileIfUploaded(
                    $app->file('item')['image'] ?? null,
                    'images/lesson/cover-' . md5((string) $data['id']) . '.{ext}'
                )?->getUri(true) ?? $data['image'];

                $repository->save($data);

                // Sync Attachment
                $existsAttachments = (array) $app->input('attachments');

                foreach ($existsAttachments as $i => $id) {
                    $orm->updateBulk(
                        Attachment::class,
                        [
                            'ordering' => $i + 1,
                        ],
                        ['id' => $id]
                    );
                }

                $attachmentMapper = $orm->mapper(Attachment::class);

                $attachments = $app->file('attachments');
                $removeAttachments = $app->input('remove_attachments') ?? [];

                foreach ($removeAttachments as $removeAttachment) {
                    $orm->deleteWhere(Attachment::class, ['id' => $removeAttachment]);
                }

                foreach ($attachments as $k => $attachment) {
                    $path = $fileUploadService->handleFileIfUploaded(
                        $attachment ?? null,
                        'lesson/' . $data['id'] . '/files/' . $attachment->getClientFilename()
                    )
                        ?->getUri();

                    if ($path) {
                        $file = $attachmentMapper->createEntity();

                        $file->type = 'lesson';
                        $file->targetId = (int) $data['id'];
                        $file->title = $attachment->getClientFilename();
                        $file->size = $attachment->getSize();
                        $file->path = $path->getPath();
                        $file->ordering = count($existsAttachments) + $k + 1;
                        $file->mime = $attachment->getClientMediaType();

                        $attachmentMapper->createOne($file);
                    }
                }

                // categories
                $item = $app->input('item');

                $categoryMapper = $orm->mapper(LessonCategoryMap::class);

                $maps = [];

                $maps[] = $mainMap = new LessonCategoryMap();
                $mainMap->lessonId = (int) $data['id'];
                $mainMap->categoryId = (int) $item['category_id'];
                $mainMap->isPrimary = true;

                foreach ($item['sub_category_id'] as $sub) {
                    $map = new LessonCategoryMap();
                    $map->lessonId = (int) $data['id'];
                    $map->categoryId = (int) $sub;
                    $map->isPrimary = false;

                    $maps[] = $map;
                }

                $categoryMapper->flush(
                    $maps,
                    [
                        'lesson_id' => (int) $data['id'],
                    ]
                );

                // Tags
                $tagService->flushTagMapsFromInput(
                    'lesson',
                    (int) $data['id'],
                    $item['tags'] ?? []
                );
            }
        );

        $uri = $app->call($controller->saveWithNamespace(...), compact('repository', 'form'));

        return match ($app->input('task')) {
            'save2close' => $nav->to('lesson_list'),
            default => $uri,
        };
    }

    public function delete(
        AppContext $app,
        #[Autowire] LessonRepository $repository,
        CrudController $controller
    ): mixed {
        return $app->call([$controller, 'delete'], compact('repository'));
    }

    public function filter(
        AppContext $app,
        #[Autowire] LessonRepository $repository,
        GridController $controller
    ): mixed {
        return $app->call([$controller, 'filter'], compact('repository'));
    }

    public function batch(
        AppContext $app,
        #[Autowire] LessonRepository $repository,
        GridController $controller
    ): mixed {
        $task = $app->input('task');

        if ($task === 'assignLessons') {
            $lessonIds = (array) $app->input('id');
            $userIds = (array) $app->input('assign')['userId'];

            return $app->call(
                $this->assignLessons(...),
                compact('lessonIds', 'userIds')
            );
        }

        $data = match ($task) {
            'publish' => ['state' => 1],
            'unpublish' => ['state' => 0],
            default => null
        };

        return $app->call([$controller, 'batch'], compact('repository', 'data'));
    }

    public function copy(
        AppContext $app,
        #[Autowire] LessonRepository $repository,
        GridController $controller
    ): mixed {
        return $app->call([$controller, 'copy'], compact('repository'));
    }

    public function assignLessons(
        AppContext $app,
        LessonDispatcher $lessonDispatcher,
        #[Input('id')] mixed $lessonIds,
        #[Input('userId')] mixed $userIds,
    ): RouteUri {
        $lessonIds = (array) $lessonIds;
        $userIds = (array) $userIds;

        if ($lessonIds === [] || $userIds === []) {
            $app->addMessage('沒有可分派的課程或用戶', 'warning');

            return $app->navBack();
        }

        foreach ($userIds as $userId) {
            foreach ($lessonIds as $lessonId) {
                $lessonDispatcher->assignLessonToUser((int) $lessonId, (int) $userId);
            }
        }

        $app->addMessage('已成功分派课程', 'success');

        return $app->navBack();
    }
}
