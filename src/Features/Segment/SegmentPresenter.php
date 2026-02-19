<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Segment;

use Lyrasoft\Luna\Tree\NodeInterface;
use Lyrasoft\Melo\Entity\Segment;
use Windwalker\DI\Attributes\Service;

#[Service]
class SegmentPresenter
{
    /**
     * @param  iterable<Segment>  $chapters
     *
     * @return  Segment|null
     */
    public static function getFirstSectionFromTree(iterable $chapters): ?Segment
    {
        foreach ($chapters as $chapter) {
            if ($chapter instanceof NodeInterface) {
                /** @var Segment $segment */
                $segment = $chapter->getValue();

                if (!$segment->parentId) {
                    return $segment;
                }

                continue;
            }

            foreach ($chapter->children as $section) {
                return $section;
            }
        }

        return null;
    }

    public static function findSectionFromTree(iterable $chapters, int|\Closure $sectionId): ?Segment
    {
        if (is_int($sectionId)) {
            $finder = fn (Segment $segment) => $segment->id === $sectionId;
        } else {
            $finder = $sectionId;
        }

        foreach ($chapters as $chapter) {
            if ($chapter instanceof NodeInterface) {
                /** @var Segment $segment */
                $segment = $chapter->getValue();

                if ($finder($segment)) {
                    return $segment;
                }

                continue;
            }

            foreach ($chapter->children as $section) {
                if ($finder($section)) {
                    return $section;
                }
            }
        }

        return null;
    }

    public static function countSectionsFromTree(iterable $chapters): int
    {
        $count = 0;

        foreach ($chapters as $chapter) {
            $count += count($chapter->children);
        }

        return $count;
    }

    public static function calcSectionsDurationFromTree(iterable $chapters): int
    {
        $duration = 0;

        /** @var Segment $chapter */
        foreach ($chapters as $chapter) {
            foreach ($chapter->children as $section) {
                $duration += $section->duration;
            }
        }

        return $duration;
    }
}
