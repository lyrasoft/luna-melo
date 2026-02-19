<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Windwalker\Data\Collection;

class SectionMenuItem
{
    public Lesson $lesson {
        get => $this->lessonStudent->lesson;
    }

    public User $user {
        get => $this->lessonStudent->user;
    }

    public ?\Closure $accessHandler = null;

    public function __construct(
        public LessonStudent $lessonStudent,
        public Segment $chapter,
        /**
         * @var Collection<SectionStudent>
         */
        public Collection $sectionStudents,
        public int $chapterIndex,
        public Segment $section,
        public int $sectionIndex,
        public int $typeIndex = 1,
        public bool $isActive = false,
    ) {
    }

    public function isDone(): bool
    {
        $status = $this->getCurrentUserMap()?->status;

        if ($status === null) {
            return false;
        }

        return $status === UserSegmentStatus::PASSED || $status === UserSegmentStatus::DONE;
    }

    public function canAccess(): bool
    {
        if ($this->accessHandler) {
            return (bool) ($this->accessHandler)($this);
        }

        // If user not logged in, lock all sections except the preview opened.
        if (!$this->lessonStudent->user->isLogin()) {
            return $this->section->preview;
        }

        // Teacher or Admin can access all sections.
        if ($this->lessonStudent->canManage) {
            return true;
        }

        // If user login, check user has lesson or not. If not, lock all sections except the preview opened.
        if (!$this->lessonStudent->map || !$this->lessonStudent->hasAccess) {
            return $this->section->preview;
        }

        if (!$this->lessonStudent->lesson->isStepByStep) {
            return true;
        }

        // If step by step, check previous section is done or not. If not, lock current section.
        $previousStudent = $this->getPreviousStudent();

        if ($previousStudent === null) {
            return false;
        }

        if ($previousStudent->status === UserSegmentStatus::PASSED || $previousStudent->status === UserSegmentStatus::DONE) {
            return true;
        }

        return false;
    }

    public function getPreviousSection(): ?Segment
    {
        $previous = null;

        foreach ($this->chapter->children as $section) {
            if ($section->id === $this->section->id) {
                break;
            }

            $previous = $section;
        }

        return $previous;
    }

    public function getCurrentStudent(): ?SectionStudent
    {
        foreach ($this->sectionStudents as $student) {
            if ($student->section->id === $this->section->id) {
                return $student;
            }
        }

        return null;
    }

    public function getCurrentUserMap(): ?UserSegmentMap
    {
        return $this->getCurrentStudent()?->map;
    }

    public function getPreviousStudent(): ?SectionStudent
    {
        $previous = null;

        foreach ($this->sectionStudents as $student) {
            if ($student->section->id === $this->section->id) {
                break;
            }

            $previous = $student;
        }

        return $previous;
    }
}
