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

    public function assignLessonToUser(User|int $user, Lesson|int $lesson, \Closure|array|null $initData = null, ?\Closure $modify = null): UserLessonMap
    {
        $userId = $user instanceof User ? $user->id : $user;
        $lessonId = $lesson instanceof Lesson ? $lesson->id : $lesson;

        $map = $this->orm->findOneOrCreate(
            UserLessonMap::class,
            [
                'lesson_id' => $lessonId,
                'user_id' => $userId,
            ],
            function (array $data) use ($initData) {
                $data['status'] = UserLessonStatus::PROCESS;

                if (is_array($initData)) {
                    $data = array_merge($data, $initData);
                } else {
                    $data = $initData($data) ?? $data;
                }

                return $data;
            },
        );

        if ($modify) {
            $map = $modify($map) ?? $map;

            $this->orm->updateOne($map);
        }

        return $map;
    }
}
