<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Segment;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\Tree\NodeInterface;
use Lyrasoft\Melo\Data\LessonProgress;
use Lyrasoft\Melo\Data\SectionStudent;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\SectionCapacity;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Lyrasoft\Melo\Features\LessonService;
use Windwalker\Core\Database\ORMAwareTrait;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Service;

use function Windwalker\collect;

#[Service]
class SegmentAttender
{
    use ORMAwareTrait;

    public function attendToSegment(User $user, Segment $segment, ?\Closure $initData = null, ?\Closure $modify = null): UserSegmentMap
    {
        $map = $this->orm->findOneOrCreate(
            UserSegmentMap::class,
            [
                'user_id' => $user->id,
                'segment_id' => $segment->id,
            ],
            function (array $data) use ($initData, $segment) {
                $data['lesson_id'] = $segment->lessonId;
                $data['segment_type'] = $segment->type;
                $data['status'] = UserSegmentStatus::PENDING;

                if ($initData) {
                    $data = $initData($data);
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

    /**
     * @param  int  $lessonId
     * @param  int  $userId
     *
     * @return  Collection<UserSegmentMap>
     */
    public function getUserSegmentMaps(int $lessonId, int $userId): Collection
    {
        return $this->orm->from(UserSegmentMap::class)
            ->where('lesson_id', $lessonId)
            ->where('user_id', $userId)
            ->all(UserSegmentMap::class);
    }

    public function getUserSegmentMap(Segment|int $segment, User|int $user): ?UserSegmentMap
    {
        $segmentId = $segment instanceof Segment ? $segment->id : $segment;
        $userId = $user instanceof User ? $user->id : $user;

        /** @var ?UserSegmentMap $map */
        $map = $this->orm->from(UserSegmentMap::class)
            ->where('segment_id', $segmentId)
            ->where('user_id', $userId)
            ->get(UserSegmentMap::class);

        return $map;
    }

    /**
     * @param  int        $lessonId
     * @param  iterable   $chapters
     * @param  User|null  $user
     *
     * @return  Collection<SectionStudent>
     */
    public function getSectionStudents(int $lessonId, iterable $chapters, ?User $user = null): Collection
    {
        if ($user && $user->isLogin()) {
            $maps = $this->getUserSegmentMaps($lessonId, $user->id)
                ->keyBy('segmentId');
        } else {
            $maps = new Collection();
        }

        $students = collect();

        foreach ($chapters as $chapter) {
            foreach ($chapter->children as $section) {
                $students[] = new SectionStudent(
                    $section,
                    $user,
                    $maps[$section->id]
                );
            }
        }

        return $students;
    }

    /**
     * @param  Collection<SectionStudent>  $sectionStudents
     *
     * @return  LessonProgress
     */
    public function computeProgress(Collection $sectionStudents): LessonProgress
    {
        $total = $sectionStudents->count();

        return new LessonProgress(
            done: function () use ($sectionStudents) {
                $passed = $sectionStudents->filter(
                    function (SectionStudent $student) {
                        if ($student->map === null) {
                            return false;
                        }

                        return $student->map->status->isDone();
                    }
                );

                return $passed->count();
            },
            total: $total,
        );
    }

    public function getUserLessonProgress(Lesson|int $lesson, ?User $user = null, ?Collection $chapters = null): LessonProgress
    {
        $lessonId = $lesson instanceof Lesson ? $lesson->id : $lesson;

        $sectionStudents = $this->getSectionStudents($lessonId, $chapters, $user);

        return $this->computeProgress($sectionStudents);
    }
}
