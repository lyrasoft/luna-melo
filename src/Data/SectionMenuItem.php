<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;

class SectionMenuItem
{
    public function __construct(
        public Lesson $lesson,
        public Segment $chapter,
        public int $chapterIndex = 1,
        public Segment $section,
        public int $sectionIndex = 1,
        public int $typeIndex = 1,
        public bool $isActive = false,
    ) {
    }
}
