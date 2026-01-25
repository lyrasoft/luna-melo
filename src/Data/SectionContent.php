<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;

class SectionContent
{
    public function __construct(
        public Lesson $lesson,
        public Segment $chapter,
        public Segment $section,
    ) {
    }
}
