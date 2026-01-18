<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Lesson;

use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\LessonCategoryMap;
use Lyrasoft\Melo\Module\Admin\Lesson\Form\EditForm;
use Lyrasoft\Melo\Repository\LessonRepository;
use Lyrasoft\Attachment\Entity\Attachment;
use Lyrasoft\Luna\Entity\TagMap;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

/**
 * The LessonEditView class.
 */
#[ViewModel(
    layout: 'lesson-edit',
    js: 'lesson-edit.js'
)]
class LessonEditView implements ViewModelInterface
{
    use TranslatorTrait;

    public function __construct(
        protected ORM $orm,
        protected FormFactory $formFactory,
        protected Navigator $nav,
        #[Autowire] protected LessonRepository $repository
    ) {
    }

    /**
     * Prepare
     *
     * @param  AppContext  $app
     * @param  View        $view
     *
     * @return  mixed
     */
    public function prepare(AppContext $app, View $view): mixed
    {
        $id = $app->input('id');

        /** @var Lesson $item */
        $item = $this->repository->getItem($id);

        // Bind item for injection
        $view[Lesson::class] = $item;

        $form = $this->formFactory
            ->create(EditForm::class)
            ->fill(
                [
                    'item' => $this->repository->getState()->getAndForget('edit.data')
                        ?: $this->orm->extractEntity($item)
                ]
            );

        $subCategoryIds = [];

        if ($item) {
            $subCategories = $this->orm->findColumn(
                LessonCategoryMap::class,
                'category_id',
                [
                    'lesson_id' => $item->id,
                    'is_primary' => 0,
                ]
            )
                ->dump(true);

            foreach ($subCategories as $id) {
                $subCategoryIds[] = (int) $id;
            }

            // Tags
            $tagIds = $this->orm->findColumn(
                TagMap::class,
                'tag_id',
                ['type' => 'lesson', 'target_id' => $item->id]
            )->dump();

            $form->fill(
                [
                    'item' => [
                        'sub_category_id' => $subCategoryIds,
                        'tags' => $tagIds
                    ]
                ]
            );
        }

        $attachments = $this->orm->findList(
            Attachment::class,
            [
                'type' => 'lesson',
                'target_id' => $item?->id
            ]
        );

        return compact(
            'form',
            'id',
            'item',
            'attachments',
            'subCategoryIds'
        );
    }

    #[ViewMetadata]
    protected function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle(
            $this->trans('unicorn.title.edit', title: '課程')
        );
    }
}
