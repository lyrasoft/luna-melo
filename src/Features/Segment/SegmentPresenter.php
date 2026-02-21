<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Segment;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\Tree\NodeInterface;
use Lyrasoft\Melo\Data\LessonStudent;
use Lyrasoft\Melo\Data\SectionMenuItem;
use Lyrasoft\Melo\Data\SectionStudent;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Lyrasoft\Melo\Features\Section\SectionComposer;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Service;

use function Windwalker\collect;

#[Service]
class SegmentPresenter
{
    public function __construct(protected SectionComposer $sectionComposer, protected SegmentAttender $segmentAttender)
    {
    }

    public function computeProgress(
        Collection $sectionStudents,
        User $user
    ): float {
        if (!$user->isLogin()) {
            return 0;
        }

        $total = $sectionStudents->count();

        if ($total === 0) {
            return 0;
        }

        $passed = $sectionStudents->filter(
            function (SectionStudent $student) {
                if ($student->map === null) {
                    return false;
                }

                return $student->map->status === UserSegmentStatus::PASSED || $student->map->status === UserSegmentStatus::DONE;
            }
        );

        return count($passed) / $total * 100;
    }

    /**
     * @param  LessonStudent  $lessonStudent
     * @param  iterable       $chapters
     * @param  Collection     $sectionStudents
     * @param  Segment|null   $currentSegment
     *
     * @return  Collection<SectionMenuItem>
     */
    public function prepareMenuItems(
        LessonStudent $lessonStudent,
        iterable $chapters,
        Collection $sectionStudents,
        ?Segment $currentSegment = null,
    ): Collection {
        $sectionTypeIndexes = [];
        $menuItems = collect();

        foreach ($chapters as $i => $chapter) {
            if ($chapter instanceof NodeInterface) {
                throw new \RuntimeException('This method only accepts chapters with sections, not nested nodes.');
            }

            /** @var Segment $section */
            foreach ($chapter->children as $j => $section) {
                $sectionTypeIndexes[$section->type] ??= 0;

                $menuItem = new SectionMenuItem(
                    lessonStudent: $lessonStudent,
                    chapter: $chapter,
                    sectionStudents: $sectionStudents,
                    chapterIndex: $i + 1,
                    section: $section,
                    sectionIndex: $j + 1,
                    typeIndex: ++$sectionTypeIndexes[$section->type],
                    isActive: $section->id === $currentSegment?->id
                );

                $menuItems[] = $menuItem;
            }
        }

        return $menuItems;
    }

    /**
     * @param  iterable<Segment>  $chapters
     *
     * @return  Segment|null
     */
    public static function getFirstSectionFromTree(iterable $chapters): ?Segment
    {
        foreach (static::iterateTreeToFlatSections($chapters) as $section) {
            return $section;
        }

        return null;
    }

    public static function getFirstPreviewableSectionFromTree(
        iterable $chapters,
        ?\Closure $filter = null
    ): ?Segment {
        foreach (static::iterateTreeToFlatSections($chapters) as $section) {
            if ($filter && !$filter($section)) {
                continue;
            }

            if ($section->preview) {
                return $section;
            }
        }

        return null;
    }

    public static function findSectionFromTree(iterable $chapters, int|\Closure $sectionId): ?Segment
    {
        if (is_int($sectionId)) {
            $finder = fn(Segment $segment) => $segment->id === $sectionId;
        } else {
            $finder = $sectionId;
        }

        foreach (static::iterateTreeToFlatSections($chapters) as $section) {
            if ($finder($section)) {
                return $section;
            }
        }

        return null;
    }

    public static function countSectionsFromTree(iterable $chapters): int
    {
        return iterator_count(static::iterateTreeToFlatSections($chapters));
    }

    public static function calcSectionsDurationFromTree(iterable $chapters): int
    {
        $duration = 0;

        foreach (static::iterateTreeToFlatSections($chapters) as $section) {
            $duration += $section->duration;
        }

        return $duration;
    }

    /**
     * @param  iterable  $chapters
     *
     * @return  \Generator<Segment>
     */
    public static function iterateTreeToFlatSections(iterable $chapters): \Generator
    {
        foreach ($chapters as $chapter) {
            if ($chapter instanceof NodeInterface) {
                /** @var Segment $segment */
                $segment = $chapter->getValue();

                yield $segment;

                continue;
            }

            foreach ($chapter->children as $section) {
                yield $section;
            }
        }
    }
}
