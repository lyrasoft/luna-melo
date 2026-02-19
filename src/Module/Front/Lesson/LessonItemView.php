<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Lesson;

use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\SegmentType;
use Lyrasoft\Melo\Features\Question\QuestionComposer;
use Lyrasoft\Melo\Features\Section\AbstractSection;
use Lyrasoft\Melo\Features\Section\Homework\HomeworkSection;
use Lyrasoft\Melo\Features\Segment\SegmentFinder;
use Lyrasoft\Melo\Features\Segment\SegmentPresenter;
use Lyrasoft\Melo\Repository\LessonRepository;
use Lyrasoft\Attachment\Entity\Attachment;
use Lyrasoft\Luna\Entity\Tag;
use Lyrasoft\Luna\Entity\TagMap;
use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Features\LessonService;
use Psr\Cache\InvalidArgumentException;
use Psr\Http\Message\ResponseInterface;
use Unicorn\Script\UnicornScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\Router\Exception\RouteNotFoundException;
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
    use TranslatorTrait;

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
        protected QuestionComposer $questionComposer,
        protected SegmentFinder $segmentFinder,
        protected AssetService $asset,
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
     * @return  mixed
     * @throws InvalidArgumentException
     */
    public function prepare(AppContext $app, View $view): mixed
    {
        $id = (int) $app->input('id');
        $alias = $app->input('alias');
        $segmentId = (int) $app->input('segment_id');

        /** @var Lesson $item */
        if ($id) {
            $item = $this->repository->mustGetItem(['id' => $id]);
        } elseif ($alias) {
            $item = $this->repository->mustGetItem(['alias' => $alias]);
        } else {
            throw new RouteNotFoundException('Lesson not found');
        }

        $canonicalMainLink = $item->makeLink($this->nav);
        $view->getHtmlFrame()->addCanonical($canonicalMainLink->full());

        $canonicalSectionLink = $item->makeLink($this->nav, $segmentId);

        if ($item->alias !== $alias) {
            return $canonicalSectionLink;
        }

        $user = $this->userService->getUser();
        
        $chapters = $this->segmentFinder->getChaptersSections($item->id);

        if ($chapters->count() === 0) {
            $app->addMessage('沒有可用章節', 'warning');

            return $this->nav->redirect('lesson_list');
        }

        if (!$segmentId) {
            $currentSegment = SegmentPresenter::getFirstSectionFromTree($chapters);
        } else {
            $currentSegment = SegmentPresenter::findSectionFromTree($chapters, $segmentId);
        }

        if (!$currentSegment) {
            $firstSegment = SegmentPresenter::getFirstSectionFromTree($chapters);

            if (!$firstSegment) {
                $app->addMessage('沒有可用章節', 'warning');

                return $this->nav->to('lesson_list');
            }

            $segmentId = $firstSegment->id;

            return $item->makeLink($this->nav, $segmentId);
        }

        $view[$item::class] = $item;
        $view[Segment::class] = $currentSegment;

        $currentChapter = $chapters->findFirst(
            fn (Segment $chapter) => $chapter->id === $currentSegment->parentId
        );

        $tags = $this->orm->from(Tag::class)
            ->whereExists(
                fn(Query $query) => $query->from(TagMap::class)
                    ->where('type', 'lesson')
                    ->where('target_id', $item->id)
                    ->where('tag_id', qn('id'))
            )
            ->getIterator(Tag::class);

        $totalChapter = $chapters->count();
        $totalSection = SegmentPresenter::countSectionsFromTree($chapters);
        $totalDuration = SegmentPresenter::calcSectionsDurationFromTree($chapters);

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

        $hasAttended = $this->lessonService->checkUserHasLesson($item->id);

        $totalAssignment = $this->orm->from(UserSegmentMap::class)
            ->where('lesson_id', $item->id)
            ->where('segment_type', HomeworkSection::id())
            ->where('assignment', '!=', '')
            ->where('front_show', 1)
            ->count();

        $lessonSectionOrder = [];

        foreach ($chapters as $k => $chapter) {
            foreach ($chapter->children as $section) {
                $lessonSectionOrder[$k][] = $section->getId();
            }
        }

        if ($user->isLogin() && $hasAttended) {
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

        $this->uniScript->data('question.defines', $this->getQuestionDefines());

        $this->uniScript->addRoute('@ajax_lesson');

        return compact(
            'item',
            'tags',
            'chapters',
            'currentChapter',
            'currentSegment',
            'totalChapter',
            'totalSection',
            'totalDuration',
            'teacher',
            'attachments',
            'hasAttended',
            'hasAttachment',
            'progress',
        );
    }

    public function activeChapter(
        Collection $chapters,
        Segment $current
    ): int|null {
        foreach ($chapters as $k => $chapter) {
            foreach ($chapter->children as $section) {
                if ($section->getId() === $current->id) {
                    return (int) $k;
                }
            }
        }

        return null;
    }

    /**
     * @return  array|array[]
     */
    public function getQuestionDefines(): array
    {
        $defines = $this->questionComposer->getDefines();

        return array_map(
            function (string $className) {
                /** @var class-string<AbstractSection> $className */

                return [
                    'id' => $className::id(),
                    'icon' => $className::icon(),
                    'title' => $className::title($this->lang),
                    'description' => $className::description($this->lang),
                    'vueComponentUrl' => $className::adminVueComponentUrl($this->asset),
                    'vueComponentName' => $className::adminVueComponentName(),
                ];
            },
            $defines
        );
    }

    #[ViewMetadata]
    public function viewMetadata(HtmlFrame $htmlFrame, Lesson $lesson): void
    {
        $title = $lesson->title;

        $htmlFrame->setTitle($title);
    }
}
