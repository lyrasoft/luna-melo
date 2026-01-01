<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Lesson;

use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\SegmentType;
use Lyrasoft\Melo\Repository\LessonRepository;
use Lyrasoft\Attachment\Entity\Attachment;
use Lyrasoft\Luna\Entity\Tag;
use Lyrasoft\Luna\Entity\TagMap;
use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Service\LessonService;
use Psr\Cache\InvalidArgumentException;
use Unicorn\Script\UnicornScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;
use Windwalker\Query\Query;

use function Windwalker\Query\qn;
use function Windwalker\where;

#[ViewModel(
    layout: 'lesson-item',
    js: 'lesson-item.js'
)]
class LessonItemView implements ViewModelInterface
{
    /**
     * Constructor.
     */
    public function __construct(
        protected ORM $orm,
        protected Navigator $nav,
        #[Autowire]
        protected LessonRepository $repository,
        protected UserService $userService,
        protected UnicornScript $uniScript,
        #[Service]
        protected LessonService $lessonService,
    ) {
        //
    }

    /**
     * Prepare View.
     *
     * @param  AppContext  $app   The web app context.
     * @param  View        $view  The view object.
     *
     * @return  \Psr\Http\Message\ResponseInterface|array
     * @throws InvalidArgumentException
     */
    public function prepare(AppContext $app, View $view): \Psr\Http\Message\ResponseInterface|array
    {
        $id = (int) $app->input('id');
        $segmentId = (int) $app->input('segment_id');

        /** @var Lesson $item */
        $item = $this->repository->mustGetItem(['id' => $id,]);
        $user = $this->userService->getUser();

        $chapters = $this->orm->from(Segment::class)
            ->where('lesson_id', $item->id)
            ->where('parent_id', 0)
            ->order('ordering', 'ASC')
            ->all(Segment::class);

        if (!$segmentId) {
            $segmentId = $this->orm->from(Segment::class)
                ->where('lesson_id', $item->id)
                ->where('parent_id', $chapters[0]->getId())
                ->order('ordering', 'ASC')
                ->get(Segment::class)
                ?->getId();

            return $this->nav->redirect(
                $this->nav->to(
                    'lesson_item',
                    [
                        'id' => $item->id,
                        'segment_id' => (int) $segmentId,
                    ]
                )
            );
        }

        $currentSegment = $this->orm->mustFindOne(
            Segment::class,
            [
                'lesson_id' => $item->id,
                'id' => $segmentId,
            ]
        );

        $tags = $this->orm->from(Tag::class)
            ->whereExists(
                fn(Query $query) => $query->from(TagMap::class)
                    ->where('type', 'lesson')
                    ->where('target_id', $item->id)
                    ->where('tag_id', qn('id'))
            )
            ->getIterator(Tag::class);

        /** @var Segment $chapter */
        foreach ($chapters as $chapter) {
            $sections = $this->orm->from(Segment::class)
                ->where('lesson_id', $item->id)
                ->where('parent_id', $chapter->id)
                ->order('ordering', 'ASC')
                ->all(Segment::class);

            $chapter->sections = $sections;
        }

        $totalChapter = $this->orm->from(Segment::class)
            ->where('lesson_id', $item->id)
            ->where('parent_id', 0)
            ->count();

        $totalSection = $this->orm->from(Segment::class)
            ->where('lesson_id', $item->id)
            ->where('parent_id', '!=', 0)
            ->count();

        $totalDuration = $this->orm->from(Segment::class)
            ->selectRaw('SUM(duration)')
            ->where('lesson_id', $item->id)
            ->result();

        $teacher = $this->orm->findOne(
            User::class,
            [
                'id' => $item->teacherId,
            ]
        );

        $hasAttachment = (bool) $this->orm->findOne(
            Attachment::class,
            [
                'type' => 'lesson',
                'target_id' => $item->id,
            ]
        );

        $attachments = $this->orm->findList(
            Attachment::class,
            [
                'type' => 'lesson',
                'target_id' => $item->id,
            ]
        );

        $ownedLesson = $this->lessonService->checkUserHasLesson($item->id);

        $totalAssignment = $this->orm->from(UserSegmentMap::class)
            ->where('lesson_id', $item->id)
            ->where('segment_type', SegmentType::HOMEWORK)
            ->where('assignment', '!=', '')
            ->where('front_show', 1)
            ->count();

        $lessonSectionOrder = [];

        foreach ($chapters as $k => $chapter) {
            foreach ($chapter->sections as $section) {
                $lessonSectionOrder[$k][] = $section->getId();
            }
        }

        if ($user->isLogin() && $ownedLesson) {
            $map = $this->orm->findOneOrCreate(
                UserSegmentMap::class,
                [
                    'user_id' => $user->id,
                    'lesson_id' => $item->id,
                    'segment_id' => $currentSegment->id,
                    'segment_type' => $currentSegment->type,
                ],
                [
                    'status' => UserSegmentStatus::PROCESS,
                ]
            );
        }

        $progress = $this->lessonService->getLessonProgress($item->id);

        $this->uniScript->data('lessonId', (int) $item->id);
        $this->uniScript->data('totalAssignment', $totalAssignment);
        $this->uniScript->data('lessonSectionOrder', $lessonSectionOrder);

        $this->uniScript->addRoute('@ajax_lesson');

        return compact(
            'item',
            'tags',
            'chapters',
            'currentSegment',
            'totalChapter',
            'totalSection',
            'totalDuration',
            'teacher',
            'attachments',
            'ownedLesson',
            'hasAttachment',
            'progress',
        );
    }

    public function activeChapter(
        Collection $chapters,
        Segment $current
    ): int|null {
        foreach ($chapters as $k => $chapter) {
            foreach ($chapter->sections as $section) {
                if ($section->getId() === $current->id) {
                    return (int) $k;
                }
            }
        }

        return null;
    }
}
