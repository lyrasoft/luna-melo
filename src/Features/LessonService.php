<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Psr\Cache\InvalidArgumentException;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;
use Windwalker\Query\Query;

use function Windwalker\Query\qn;

/**
 * The LessonService class.
 */
#[Service]
class LessonService
{
    public function __construct(
        protected ORM $orm,
        protected UserService $userService,
    ) {
    }

    public function myLessonCount(): int
    {
        $userId = $this->userService->getUser()->id;

        return (int) $this->orm->from(Lesson::class, 'lesson')
            ->whereExists(
                fn(Query $query) => $query->from(UserLessonMap::class)
                    ->where('user_id', $userId)
                    ->where('lesson_id', qn('lesson.id'))
            )
            ->where('state', 1)
            ->count();
    }

    public function myLectureCount(): int
    {
        $userId = $this->userService->getUser()->id;

        return (int) $this->orm->from(Lesson::class)
            ->where('teacher_id', $userId)
            ->where('state', 1)
            ->count();
    }

    public function getUserLessonMap(
        int $lessonId,
        User $user
    ): ?UserLessonMap {
        return $this->orm->findOne(
            UserLessonMap::class,
            [
                'user_id' => $user->id,
                'lesson_id' => $lessonId,
            ]
        );
    }

    /**
     * @param  int  $lessonId
     *
     * @return  bool
     *
     * @throws \Psr\Cache\InvalidArgumentException
     */
    public function checkUserHasLesson(
        int $lessonId,
        ?User $user = null
    ): bool {
        if (!$this->userService->isLogin()) {
            return false;
        }

        $user ??= $this->userService->getCurrentUser();

        return (bool) $this->getUserLessonMap($lessonId, $user);

        // $exist = (bool) $this->orm->from(MeloOrder::class, 'order')
        //     ->where('user_id', $user->id)
        //     ->whereExists(
        //         fn (Query $query) => $query->from(MeloOrderItem::class)
        //             ->where('lesson_id', $lessonId)
        //             ->where('order_id', qn('order.id'))
        //     )
        //     ->get();
        //
        // return $exist || $this->orm->findOne(
        //     UserLessonMap::class,
        //     [
        //         'user_id' => $user->id,
        //         'lesson_id' => $lessonId,
        //     ]
        // );
    }
}
