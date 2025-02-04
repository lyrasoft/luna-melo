<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Lesson;

use Lyrasoft\Luna\Entity\Category;
use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\Entity\UserRoleMap;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Repository\LessonRepository;
use Unicorn\Html\Breadcrumb;
use Unicorn\Selector\ListSelector;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Pagination\PaginationFactory;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;
use Windwalker\Query\Query;

use function Windwalker\Query\qn;

#[ViewModel(
    layout: 'lesson-list',
    js: 'lesson-list.js'
)]
class LessonListView implements ViewModelInterface
{
    /**
     * Constructor.
     */
    public function __construct(
        #[Autowire]
        protected LessonRepository $lessonRepository,
        protected PaginationFactory $paginationFactory,
        protected Breadcrumb $breadcrumb,
        protected ORM $orm,
    ) {
        //
    }

    /**
     * Prepare View.
     *
     * @param  AppContext  $app   The web app context.
     * @param  View        $view  The view object.
     *
     * @return  mixed
     */
    public function prepare(AppContext $app, View $view): array
    {
        $categoryId = (int) $app->input('category');
        $teacherId = (int) $app->input('teacher');
        $search = (string) $app->input('search');
        $page = (int) $app->input('page');
        $limit = 12;

        $category = $this->orm->findOne(
            Category::class,
            [
                'id' => $categoryId
            ]
        );

        $items = $this->lessonRepository->getListSelector()
            ->addFilter('lesson.state', 1)
            ->tapIf(
                (bool) $category,
                fn(ListSelector $query) => $query->where('category.lft', '>=', $category->getLft())
                    ->where('category.rgt', '<=', $category->getRgt())
            )
            ->tapIf(
                (bool) $teacherId,
                fn(ListSelector $query) => $query->where(
                    'teacher.id',
                    $teacherId
                )
            )
            ->searchTextFor(
                $search,
                $this->getSearchFields()
            )
            ->page($page)
            ->limit($limit)
            ->ordering('lesson.created', 'DESC')
            ->setDefaultItemClass(Lesson::class);

        $total = $items->count();

        $pagination = $items->getPagination();

        $this->prepareMetadata($view->getHtmlFrame());

        $categories = $this->orm->findList(
            Category::class,
            [
                'type' => 'lesson',
                'state' => 1
            ]
        );

        $teachers = $this->orm->from(User::class)
            ->whereExists(
                fn(Query $query) => $query->from(UserRoleMap::class)
                    ->where('role_id', 'teacher')
                    ->where('user_id', qn('user.id'))
            )
            ->where('user.enabled', 1)
            ->getIterator(User::class);

        return compact(
            'items',
            'pagination',
            'total',
            'categoryId',
            'teacherId',
            'search',
            'categories',
            'teachers',
        );
    }

    #[ViewMetadata]
    protected function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle('搜尋課程');
    }

    /**
     * @return  string[]
     */
    public function getSearchFields(): array
    {
        return [
            'lesson.id',
            'lesson.title',
            'lesson.alias',
        ];
    }
}
