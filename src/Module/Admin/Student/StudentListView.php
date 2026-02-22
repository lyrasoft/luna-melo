<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Student;

use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Melo\Module\Admin\Student\Form\GridForm;
use Lyrasoft\Melo\Repository\UserLessonMapRepository;
use Unicorn\View\FormAwareViewModelTrait;
use Unicorn\View\ORMAwareViewModelTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\View\Contract\FilterAwareViewModelInterface;
use Windwalker\Core\View\Traits\FilterAwareViewModelTrait;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

/**
 * The StudentListView class.
 */
#[ViewModel(
    layout: [
        'default' => 'student-list',
        'modal' => 'student-modal',
    ],
    js: 'student-list.js'
)]
class StudentListView implements ViewModelInterface, FilterAwareViewModelInterface
{
    use TranslatorTrait;
    use FilterAwareViewModelTrait;
    use ORMAwareViewModelTrait;
    use FormAwareViewModelTrait;

    public function __construct(
        protected ORM $orm,
        #[Autowire]
        protected UserLessonMapRepository $repository,
        protected FormFactory $formFactory
    ) {
    }

    /**
     * Prepare view data.
     *
     * @param  AppContext  $app   The request app context.
     * @param  View        $view  The view object.
     *
     * @return  array
     */
    public function prepare(AppContext $app, View $view): array
    {
        $lessonId = $app->input('lesson_id');

        $state = $this->repository->getState();

        $lesson = $this->orm->mustFindOne(Lesson::class, $lessonId);

        // Prepare Items
        $page = $state->rememberFromRequest('page');
        $limit = $state->rememberFromRequest('limit') ?? 30;
        $filter = (array) $state->rememberMergeRequest('filter');
        $search = (array) $state->rememberMergeRequest('search');
        $ordering = $state->rememberFromRequest('list_ordering') ?? $this->getDefaultOrdering();

        $items = $this->repository->getListSelector()
            ->setFilters($filter)
            ->searchTextFor(
                $search['*'] ?? '',
                $this->getSearchFields()
            )
            ->where('user_lesson_map.lesson_id', (int) $lessonId)
            ->ordering($ordering)
            ->page($page)
            ->limit($limit)
            ->setDefaultItemClass(UserLessonMap::class);

        $pagination = $items->getPagination();

        // Prepare Form
        $form = $this->createForm(GridForm::class)
            ->fill(compact('search', 'filter'));

        $showFilters = $this->isFiltered($filter);

        return compact(
            'items',
            'pagination',
            'form',
            'showFilters',
            'ordering',
            'lessonId',
            'lesson'
        );
    }

    /**
     * Get default ordering.
     *
     * @return  string
     */
    public function getDefaultOrdering(): string
    {
        return 'user_lesson_map.id DESC';
    }

    /**
     * Get search fields.
     *
     * @return  string[]
     */
    public function getSearchFields(): array
    {
        return [
            'user_lesson_map.id',
            'lesson.title',
            'user.name',
        ];
    }

    #[ViewMetadata]
    protected function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle(
            $this->trans('unicorn.title.grid', title: '學生列表')
        );
    }
}
