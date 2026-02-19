<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;
use Windwalker\Data\Collection;

class SectionContent
{
    public Lesson $lesson {
        get => $this->context->lesson;
    }

    public User $user {
        get => $this->context->lessonStudent->user;
    }

    public Segment $chapter {
        get => $this->context->currentChapter;
    }

    public Segment $section {
        get => $this->context->currentSection;
    }

    /**
     * @var Collection<SectionStudent>
     */
    public Collection $sectionStudents {
        get => $this->context->sectionStudents;
    }

    public function __construct(
        public LessonProgressContext $context,
    ) {
    }
}
