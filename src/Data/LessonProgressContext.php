<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Windwalker\Data\Collection;

class LessonProgressContext
{
    public Lesson $lesson {
        get => $this->lessonStudent->lesson;
    }

    public ?User $user {
        get => $this->lessonStudent->user;
    }

    public ?UserLessonMap $userLessonMap {
        get => $this->lessonStudent->map;
    }

    public bool $hasAttended {
        get => $this->userLessonMap !== null;
    }

    public bool $canManage {
        get => $this->lessonStudent->canManage;
    }

    public function __construct(
        public LessonStudent $lessonStudent,
        public LessonProgress $progress,
        /**
         * @var Collection<SectionMenuItem>
         */
        public Collection $menuItems,
        public ?Segment $currentSection,
        public ?Segment $currentChapter,
        public ?SectionMenuItem $activeMenuItem,
        public Collection $sectionStudents,
        public ?SectionStudent $currentSectionStudent,
        /**
         * @var Collection<Segment>
         */
        public Collection $chapters = new Collection(),
    ) {
    }

    /**
     * @param  int  $chapterId
     *
     * @return  Collection<SectionMenuItem>
     */
    public function getChapterSectionMenuItems(int $chapterId): Collection
    {
        return $this->menuItems->filter(
            fn (SectionMenuItem $menuItem) => $menuItem->section->parentId === $chapterId
        );
    }

    public function getSectionMenuItem(int $sectionId): ?SectionMenuItem
    {
        return $this->menuItems->findFirst(
            fn (SectionMenuItem $menuItem) => $menuItem->section->id === $sectionId
        );
    }

    public function canAccess(): bool
    {
        if ($this->activeMenuItem) {
            return $this->activeMenuItem->canAccess();
        }

        return false;
    }
}
