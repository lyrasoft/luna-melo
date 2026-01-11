<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features;

use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
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
            ->selectRaw('COUNT(id) AS count')
            ->whereExists(
                fn(Query $query) => $query->from(UserLessonMap::class)
                    ->where('user_id', $userId)
                    ->where('lesson_id', qn('id'))
            )
            ->where('state', 1)
            ->result();
    }

    public function myLectureCount(): int
    {
        $userId = $this->userService->getUser()->id;

        return (int) $this->orm->from(Lesson::class)
            ->selectRaw('COUNT(id) AS count')
            ->where('teacher_id', $userId)
            ->where('state', 1)
            ->result();
    }

    /**
     * @param  int  $lessonId
     *
     * @return  float|int
     *
     * @throws \Psr\Cache\InvalidArgumentException
     */
    public function getLessonProgress(
        int $lessonId
    ): float {
        if (!$this->userService->isLogin()) {
            return 0;
        }

        $userId = $this->userService->getUser()->id;

        $total = $this->orm->from(Segment::class)
            ->where('lesson_id', $lessonId)
            ->where('parent_id', '!=', 0)
            ->count();

        if ($total === 0) {
            return 0;
        }

        $userPassedSegmentCount = $this->orm->from(UserSegmentMap::class)
            ->where('lesson_id', $lessonId)
            ->where('user_id', $userId)
            ->orWhere(
                function (Query $query) {
                    $query->where('status', UserSegmentStatus::DONE);
                    $query->where('status', UserSegmentStatus::PASSED);
                }
            )
            ->count();

        return $userPassedSegmentCount / $total * 100;
    }

    /**
     * @param  int  $lessonId
     *
     * @return  bool
     *
     * @throws \Psr\Cache\InvalidArgumentException
     */
    public function checkUserHasLesson(
        int $lessonId
    ): bool {
        if (!$this->userService->isLogin()) {
            return false;
        }

        $user = $this->userService->getCurrentUser();

        $exist = (bool) $this->orm->from(MeloOrder::class)
            ->where('user_id', $user->id)
            ->whereExists(
                fn (Query $query) => $query->from(MeloOrderItem::class)
                    ->where('lesson_id', $lessonId)
                    ->where('order_id', qn('order.id'))
            )
            ->get();

        return $exist || $this->orm->findOne(
            UserLessonMap::class,
            [
                'user_id' => $user->id,
                'lesson_id' => $lessonId,
            ]
        );
    }
}
