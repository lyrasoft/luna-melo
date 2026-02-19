<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Data;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\UserLessonMap;

class LessonStudent
{
    public function __construct(
        public Lesson $lesson,
        public User $user,
        public ?UserLessonMap $map = null,
        public bool $hasAccess = true,
        public bool $canManage = false,
    ) {
    }
}
