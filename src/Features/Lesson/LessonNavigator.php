<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Lesson;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Data\LessonProgressContext;
use Lyrasoft\Melo\Data\LessonStudent;
use Lyrasoft\Melo\Data\SectionMenuItem;
use Lyrasoft\Melo\Data\SectionStudent;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Features\LessonService;
use Lyrasoft\Melo\Features\Segment\SegmentAttender;
use Lyrasoft\Melo\Features\Segment\SegmentFinder;
use Lyrasoft\Melo\Features\Segment\SegmentPresenter;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Service;

#[Service]
class LessonNavigator
{
    public function __construct(
        protected SegmentAttender $segmentAttender,
        protected SegmentPresenter $segmentPresenter,
        protected SegmentFinder $segmentFinder,
        protected LessonService $lessonService,
    ) {
    }

    /**
     * @param  int  $lessonId
     *
     * @return  Collection<Segment>
     */
    public function getChaptersSections(int $lessonId): Collection
    {
        return $this->segmentFinder->getChaptersSections($lessonId);
    }

    public function getLessonProgressContext(
        Lesson $lesson,
        User $user,
        Segment $currentSection,
        ?Collection $chapters = null
    ): LessonProgressContext {
        $chapters ??= $this->getChaptersSections($lesson->id);

        $currentChapter = $chapters->findFirst(
            fn(Segment $chapter) => $chapter->id === $currentSection->parentId
        );

        $userLessonMap = $this->lessonService->getUserLessonMap($lesson->id, $user);

        $lessonStudent = new LessonStudent(
            lesson: $lesson,
            user: $user,
            map: $userLessonMap
        );

        $sectionStudents = $this->segmentAttender->getSectionStudents($lesson->id, $chapters, $user);
        $progress = $this->segmentPresenter->computeProgress($sectionStudents, $user);

        $currentSectionStudent = $sectionStudents->findFirst(
            fn(SectionStudent $student) => $student->section->id === $currentSection->id
        );

        $menuItems = $this->segmentPresenter->prepareMenuItems(
            $lessonStudent,
            $chapters,
            $sectionStudents,
            $currentSection
        );

        $active = $menuItems->findFirst(
            fn(SectionMenuItem $item) => $item->section->id === $currentSection->id
        );

        return new LessonProgressContext(
            lessonStudent: $lessonStudent,
            progress: $progress,
            menuItems: $menuItems,
            currentSection: $currentSection,
            currentChapter: $currentChapter,
            activeMenuItem: $active,
            sectionStudents: $sectionStudents,
            currentSectionStudent: $currentSectionStudent,
            chapters: $chapters,
        );
    }
}
