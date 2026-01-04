<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Segment;

use Lyrasoft\Melo\Entity\Segment;
use Windwalker\Core\Database\ORMAwareTrait;
use Windwalker\Data\Collection;

use Windwalker\DI\Attributes\Service;

use function Windwalker\collect;

#[Service]
class SegmentFinder
{
    use ORMAwareTrait;

    /**
     * @param  int  $lessonId
     *
     * @return  Collection<Segment>
     */
    public function getSegmentsTree(int $lessonId): Collection
    {
        $segments = $this->orm->from(Segment::class)
            ->where('lesson_id', $lessonId)
            ->order('parent_id', 'ASC')
            ->order('ordering', 'ASC')
            ->all(Segment::class);

        $chapters = collect();

        /** @var Segment $segment */
        foreach ($segments as $segment) {
            if (!$segment->parentId) {
                $chapters[$segment->id] = $segment;
            } else {
                $chapters[$segment->parentId]->children ??= collect();
                $chapters[$segment->parentId]->children[] = $segment;
            }
        }
        
        return $chapters->values();
    }
}
