<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Segment;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Windwalker\Core\Database\ORMAwareTrait;
use Windwalker\DI\Attributes\Service;

#[Service]
class SegmentAttender
{
    use ORMAwareTrait;

    public function attendToSegment(User $user, Segment $segment, ?\Closure $configure = null): UserSegmentMap
    {
        $map = $this->orm->findOneOrCreate(
            UserSegmentMap::class,
            [
                'user_id' => $user->id,
                'segment_id' => $segment->id,
            ],
            function (array $data) use ($segment) {
                $data['lesson_id'] = $segment->lessonId;
                $data['segment_type'] = $segment->type;
                $data['status'] = UserSegmentStatus::PENDING;

                return $data;
            },
        );

        if ($configure) {
            $map = $configure($map) ?? $map;

            $this->orm->updateOne($map);
        }

        return $map;
    }
}
