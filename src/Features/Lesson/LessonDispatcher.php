<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Lesson;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Melo\Enum\UserLessonStatus;
use Windwalker\Core\Database\ORMAwareTrait;
use Windwalker\DI\Attributes\Service;

#[Service]
class LessonDispatcher
{
    use ORMAwareTrait;

    public function assignLessonToUser(User|int $user, Lesson|int $lesson): UserLessonMap
    {
        $userId = $user instanceof User ? $user->id : $user;
        $lessonId = $lesson instanceof Lesson ? $lesson->id : $lesson;

        return $this->orm->findOneOrCreate(
            UserLessonMap::class,
            [
                'lesson_id' => $lessonId,
                'user_id' => $userId,
            ],
            ['status' => UserLessonStatus::PROCESS]
        );
    }
}
