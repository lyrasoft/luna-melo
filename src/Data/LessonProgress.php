<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

class LessonProgress
{
    public float $percentage {
        get {
            if ($this->total === 0) {
                return 0;
            }

            return round($this->done / $this->total * 100, 2);
        }
    }

    public function __construct(
        public int $done = 0,
        public int $total = 0,
    ) {
    }
}
