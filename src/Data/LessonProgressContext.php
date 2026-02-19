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

    public function __construct(
        public LessonStudent $lessonStudent,
        public float $progress,
        public Collection $menuItems,
        public Segment $currentSection,
        public Segment $currentChapter,
        public ?SectionMenuItem $activeMenuItem,
        public Collection $sectionStudents,
        public SectionStudent $currentSectionStudent,
        public Collection $chapters = new Collection(),
    ) {
    }

    public function canAccess(): bool
    {
        if ($this->activeMenuItem) {
            return $this->activeMenuItem->canAccess();
        }

        return false;
    }
}
