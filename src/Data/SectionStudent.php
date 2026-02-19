<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\UserSegmentStatus;

class SectionStudent
{
    public ?UserSegmentStatus $status {
        get => $this->map?->status;
    }

    public function __construct(
        public Segment $section,
        public User $user,
        public ?UserSegmentMap $map = null,
    ) {
    }
}
