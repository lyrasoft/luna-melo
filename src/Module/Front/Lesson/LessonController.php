<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Lesson;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Features\Section\Homework\HomeworkSection;
use Unicorn\Attributes\Ajax;
use Unicorn\Controller\AjaxControllerTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\Method;
use Windwalker\ORM\ORM;

/**
 * The LessonController class.
 */
#[Controller()]
class LessonController
{
    use AjaxControllerTrait;

    #[Ajax]
    #[Method('GET')]
    public function prepareStudentAssignments(
        AppContext $app,
        ORM $orm,
    ): object {
        $lessonId = (int) $app->input('lesson_id');
        $offset = (int) $app->input('offset');
        $limit = (int) $app->input('limit');

        return $orm->from(UserSegmentMap::class, 'map')
            ->leftJoin(User::class, 'user', 'map.user_id', 'user.id')
            ->where('map.lesson_id', $lessonId)
            ->where('map.segment_type', HomeworkSection::id())
            ->where('map.assignment', '!=', '')
            ->where('map.front_show', 1)
            ->order('map.modified', 'DESC')
            ->order('map.created', 'DESC')
            ->limit($limit)
            ->offset($offset)
            ->groupByJoins()
            ->all(UserSegmentMap::class);
    }
}
