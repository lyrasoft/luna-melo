<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Segment;

use Lyrasoft\Luna\Tree\Node;
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
     * @return  Node<Segment>
     */
    public function getSegmentsTreeNodes(int $lessonId): Node
    {
        $segments = $this->orm->from(Segment::class)
            ->where('lesson_id', $lessonId)
            ->order('parent_id', 'ASC')
            ->order('ordering', 'ASC')
            ->all(Segment::class);

        $root = new Node();
        $nodes = [];

        foreach ($segments as $segment) {
            $nodes[$segment->id] = new Node($segment);
        }

        foreach ($nodes as $node) {
            /** @var Segment $segment */
            $segment = $node->getValue();

            if (!$segment->parentId) {
                $root->addChild($node);
            } else {
                $nodes[$segment->parentId]->addChild($node);
            }
        }

        return $root;
    }

    /**
     * @param  int  $lessonId
     *
     * @return  Collection<Segment>
     */
    public function getChaptersSections(int $lessonId): Collection
    {
        $segments = $this->orm->from(Segment::class)
            ->where('lesson_id', $lessonId)
            ->order('parent_id', 'ASC')
            ->order('ordering', 'ASC')
            ->all(Segment::class);

        /** @var Collection<Segment> $chapters */
        $chapters = collect();

        /** @var Segment $segment */
        foreach ($segments as $segment) {
            if (!$segment->parentId) {
                $chapters[$segment->id] = $segment;
            } else {
                $chapters[$segment->parentId]->children[] = $segment;
            }
        }

        return $chapters->values();
    }
}
