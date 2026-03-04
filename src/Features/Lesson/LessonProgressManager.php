<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Lesson;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Data\LessonProgress;
use Lyrasoft\Melo\Data\LessonProgressContext;
use Lyrasoft\Melo\Data\SectionMenuItem;
use Lyrasoft\Melo\Data\SectionStudent;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Features\LessonService;
use Lyrasoft\Melo\Features\Segment\SegmentAttender;
use Lyrasoft\Melo\Features\Segment\SegmentFinder;
use Lyrasoft\Melo\Features\Segment\SegmentPresenter;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

#[Service]
class LessonProgressManager
{
    use InstanceCacheTrait;

    public function __construct(
        protected ORM $orm,
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

    public function canAccess(Segment $segment, User $user, ?Lesson $lesson = null, ?Collection $chapters = null): bool
    {
        $lesson ??= $this->orm->mustFindOne(Lesson::class, $segment->lessonId);

        return $this->getLessonProgressContext($lesson, $user, $segment, $chapters)->canAccess();
    }

    public function getLessonProgressContext(
        Lesson $lesson,
        User $user,
        ?Segment $currentSection = null,
        ?Collection $chapters = null
    ): LessonProgressContext {
        return $this->once(
            'context.' . $lesson->id . '.' . $user->id . '.' . ($currentSection?->id ?? 'null'),
            function () use ($lesson, $user, $currentSection, $chapters) {
                $chapters ??= $this->getChaptersSections($lesson->id);

                $currentChapter = $chapters->findFirst(
                    fn(Segment $chapter) => $chapter->id === $currentSection?->parentId
                );

                $lessonStudent = $this->lessonService->getLessonStudent($lesson, $user);
                $sectionStudents = $this->segmentAttender->getSectionStudents($lesson->id, $chapters, $user);
                $progress = $this->computeProgress($sectionStudents, $user);

                $currentSectionStudent = $sectionStudents->findFirst(
                    fn(SectionStudent $student) => $student->section->id === $currentSection?->id
                );

                $menuItems = $this->segmentPresenter->prepareMenuItems(
                    $lessonStudent,
                    $chapters,
                    $sectionStudents,
                    $currentSection
                );

                $active = $menuItems->findFirst(
                    fn(SectionMenuItem $item) => $item->section->id === $currentSection?->id
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
        );
    }

    /**
     * @param  Collection<SectionStudent>  $sectionStudents
     * @param  User                        $user
     *
     * @return  LessonProgress
     */
    public function computeProgress(
        Collection $sectionStudents,
        User $user
    ): LessonProgress {
        if (!$user->isLogin()) {
            return new LessonProgress(
                done: 0,
                total: 0,
            );
        }

        return $this->segmentAttender->computeProgress($sectionStudents);
    }

    /**
     * @param  User             $user
     * @param  Segment          $segment
     * @param  \Closure|null    $initData
     * @param  \Closure|null    $modify
     * @param  Collection|null  $chapters
     *
     * @return  array{ UserSegmentMap, LessonProgress }
     */
    public function attendToSegmentAndUpdateProgress(
        User $user,
        Segment $segment,
        ?\Closure $initData = null,
        ?\Closure $modify = null,
        ?Collection $chapters = null,
    ): array {
        $map = $this->segmentAttender->attendToSegment($user, $segment, $initData, $modify);

        $progress = $this->syncLessonProgress($map->lessonId, $user, $chapters);

        return [$map, $progress];
    }

    public function syncLessonProgress(Lesson|int $lesson, User $user, ?Collection $chapters = null): LessonProgress
    {
        $lessonId = $lesson instanceof Lesson ? $lesson->id : $lesson;

        $chapters ??= $this->segmentFinder->getChaptersSections($lessonId);

        $progress = $this->segmentAttender->getUserLessonProgress($lessonId, $user, $chapters);

        /** @var UserLessonMap $map */
        $map = $this->lessonService->getUserLessonMap($lesson, $user);

        $map->progress = $progress->percentage;

        $this->orm->updateOne($map);

        return $progress;
    }
}
