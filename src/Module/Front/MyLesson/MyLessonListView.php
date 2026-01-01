<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\MyLesson;

use Lyrasoft\Luna\User\Exception\AccessDeniedException;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Melo\Repository\LessonRepository;
use Lyrasoft\Luna\Repository\UserRepository;
use Lyrasoft\Luna\User\UserService;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\Query\Query;

use function Windwalker\Query\qn;

#[ViewModel(
    layout: 'my-lesson-list',
    js: 'my-lesson-list.js'
)]
class MyLessonListView implements ViewModelInterface
{
    /**
     * Constructor.
     */
    public function __construct(
        #[Autowire]
        protected LessonRepository $repository,
        #[Autowire]
        protected UserRepository $userRepository,
        protected UserService $userService,
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
        if (!$this->userService->isLogin()) {
            throw new AccessDeniedException('請先登入', 403);
        }

        $userId = $this->userService->getUser()->id;

        $page = (int) $app->input('page');
        $limit = 12;

        $userInfo = $this->userRepository->getListSelector()
            ->addFilter('user.id', $userId)
            ->get();

        $items = $this->repository->getListSelector()
            ->whereExists(
                fn(Query $query) => $query->from(UserLessonMap::class)
                    ->where('user_id', $userId)
                    ->where('lesson_id', qn('lesson.id'))
            )
            ->addFilter('lesson.state', 1)
            ->page($page)
            ->limit($limit)
            ->ordering('lesson.created', 'DESC')
            ->setDefaultItemClass(Lesson::class);

        $pagination = $items->getPagination();

        return compact('userInfo', 'items', 'pagination');
    }
}
