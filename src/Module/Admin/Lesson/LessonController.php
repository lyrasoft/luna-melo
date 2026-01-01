<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Lesson;

use Lyrasoft\Melo\Entity\LessonCategoryMap;
use Lyrasoft\Melo\Module\Admin\Lesson\Form\EditForm;
use Lyrasoft\Melo\Repository\LessonRepository;
use Lyrasoft\Attachment\Entity\Attachment;
use Unicorn\Controller\CrudController;
use Unicorn\Controller\GridController;
use Unicorn\Upload\FileUploadManager;
use Unicorn\Upload\FileUploadService;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Router\Navigator;
use Windwalker\DI\Attributes\Autowire;
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
        #[Service(FileUploadManager::class, 'image')]
        FileUploadService $fileUploadService,
        ORM $orm,
    ): mixed {
        $form = $app->make(EditForm::class);

        $controller->afterSave(
            function (AfterSaveEvent $event) use ($fileUploadService, $repository, $app, $orm) {
                $data = $event->getData();

                $data['image'] = $fileUploadService->handleFileIfUploaded(
                    $app->file('item')['image'] ?? null,
                    'images/lesson/cover-' . md5((string) $data['id']) . '.{ext}'
                )?->getUri(true) ?? $data['image'];

                $repository->save($data);

                // Sync Attachment
                $existsAttachments = (array) $app->input('attachments');

                foreach ($existsAttachments as $i => $id) {
                    $orm->updateWhere(
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
                $items = $app->input('item');

                $categoryMapper = $orm->mapper(LessonCategoryMap::class);

                $categoryMapper->flush(
                    [
                        [
                            'lesson_id' => (int) $data['id'],
                            'category_id' => (int) $items['category_id'],
                            'is_primary' => 1,
                        ],
                    ],
                    [
                        'lesson_id' => (int) $data['id'],
                        'is_primary' => 1,
                    ]
                );

                $subCategoryItems = [];

                foreach ($app->input('item')['sub_category_id'] as $sub) {
                    $subCategoryItems[] = [
                        'lesson_id' => (int) $data['id'],
                        'category_id' => (int) $sub,
                        'is_primary' => 0,
                    ];
                }

                $categoryMapper->flush(
                    $subCategoryItems,
                    [
                        'lesson_id' => (int) $data['id'],
                        'is_primary' => 0,
                    ]
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
}
