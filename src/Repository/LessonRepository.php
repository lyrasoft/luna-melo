<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Repository;

use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Luna\Entity\Category;
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

#[Repository(entityClass: Lesson::class)]
class LessonRepository implements ManageRepositoryInterface, ListRepositoryInterface
{
    use ManageRepositoryTrait;
    use ListRepositoryTrait;

    public function getListSelector(): ListSelector
    {
        $selector = $this->createSelector();

        $selector->from(Lesson::class)
            ->leftJoin(Category::class, 'category', 'category.id', 'lesson.category_id')
            ->leftJoin(User::class, 'teacher', 'teacher.id', 'lesson.teacher_id');

        return $selector;
    }

    public function getFrontListSelector(): ListSelector
    {
        $selector = $this->createSelector();

        $selector->from(Lesson::class);

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
