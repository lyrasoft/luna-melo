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

    public int $done {
        get => $this->computeDone();
    }

    protected \Closure|int $doneValue = 0;

    protected bool $computed = false;

    public function __construct(
        \Closure|int $done = 0,
        public int $total = 0,
    ) {
        $this->doneValue = $done;
    }

    public function computeDone(): int
    {
        static $done = 0;

        if ($this->doneValue instanceof \Closure) {
            if (!$this->computed) {
                $done = ($this->doneValue)();

                $this->computed = true;
            }

            return $done;
        }

        return $this->doneValue;
    }

    public function reset(): void
    {
        $this->computed = false;
    }
}
