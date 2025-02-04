<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Repository;

use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Luna\Entity\User;
use Unicorn\Attributes\ConfigureAction;
use Unicorn\Attributes\Repository;
use Unicorn\Repository\Actions\BatchAction;
use Unicorn\Repository\Actions\ReorderAction;
use Unicorn\Repository\Actions\SaveAction;
use Unicorn\Repository\ListRepositoryInterface;
use Unicorn\Repository\ListRepositoryTrait;
use Unicorn\Repository\ManageRepositoryInterface;
use Unicorn\Repository\ManageRepositoryTrait;
use Unicorn\Selector\ListSelector;
use Windwalker\ORM\SelectorQuery;

#[Repository(entityClass: UserLessonMap::class)]
class UserLessonMapRepository implements ManageRepositoryInterface, ListRepositoryInterface
{
    use ManageRepositoryTrait;
    use ListRepositoryTrait;

    public function getListSelector(): ListSelector
    {
        $selector = $this->createSelector();

        $selector->from(UserLessonMap::class)
            ->leftJoin(Lesson::class, 'lesson', 'lesson.id', 'user_lesson_map.lesson_id')
            ->leftJoin(User::class, 'user', 'user.id', 'user_lesson_map.user_id');

        return $selector;
    }

    #[ConfigureAction(SaveAction::class)]
    protected function configureSaveAction(SaveAction $action): void
    {
        //
    }

    #[ConfigureAction(ReorderAction::class)]
    protected function configureReorderAction(ReorderAction $action): void
    {
        //
    }

    #[ConfigureAction(BatchAction::class)]
    protected function configureBatchAction(BatchAction $action): void
    {
        //
    }
}
