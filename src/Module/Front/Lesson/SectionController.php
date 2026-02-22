<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Segment;

use Brick\Math\BigDecimal;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Question;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserAnswer;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Lyrasoft\Melo\Features\Lesson\LessonProgressManager;
use Lyrasoft\Melo\Features\LessonService;
use Lyrasoft\Melo\Features\Question\QuestionComposer;
use Lyrasoft\Melo\Features\Section\Quiz\QuizSection;
use Lyrasoft\Melo\Features\Segment\SegmentAttender;
use Psr\Cache\InvalidArgumentException;
use Unicorn\Attributes\Ajax;
use Unicorn\Aws\S3Service;
use Unicorn\Controller\AjaxControllerTrait;
use Unicorn\Upload\FileUploadManager;
use Unicorn\Upload\FileUploadService;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\Filter;
use Windwalker\Core\Attributes\Method;
use Windwalker\Core\Attributes\Request\Input;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Form\Exception\ValidateFailException;
use Windwalker\Core\Router\Exception\RouteNotFoundException;
use Windwalker\Core\Security\Exception\UnauthorizedException;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DI\Attributes\Service;
use Windwalker\Http\Response\RedirectResponse;
use Windwalker\ORM\ORM;

use function Windwalker\response;

#[Controller]
class SectionController
{
    use AjaxControllerTrait;

    #[Ajax]
    public function item(
        LessonProgressManager $lessonProgressManager,
        ORM $orm,
        UserService $userService,
        #[Input, Filter('int')] int $id
    ): Segment {
        $segment = $orm->mustFindOne(Segment::class, $id);

        $user = $userService->getUser();

        if (!$lessonProgressManager->canAccess($segment, $user)) {
            throw new RouteNotFoundException();
        }

        return $segment;
    }

    public function file(
        ORM $orm,
        LessonProgressManager $lessonProgressManager,
        SegmentAttender $segmentAttender,
        UserService $userService,
        S3Service $s3Service,
        #[Input, Filter('int')] int $id,
        #[Input] string $field = 'src'
    ): RedirectResponse {
        $section = $orm->mustFindOne(Segment::class, $id);

        $user = $userService->getUser();

        if (!$lessonProgressManager->canAccess($section, $user)) {
            throw new RouteNotFoundException();
        }

        $url = match ($field) {
            'src' => $section->src,
            'caption' => $section->captionSrc,
            default => throw new RouteNotFoundException(),
        };

        if (str_contains($url, 'sintel')) {
            return response()->redirectOutside($url);
        }

        $url = $s3Service->getPresignedUrl($url, '+200seconds');

        return response()->redirectOutside($url);
    }

    #[Ajax]
    #[Method('POST')]
    public function submitQuiz(
        AppContext $app,
        ORM $orm,
        UserService $userService,
        QuestionComposer $questionComposer,
        SegmentAttender $segmentAttender,
        LessonService $lessonService,
        #[Input('segment_id'), Filter('int')] int $segmentId,
        #[Input('quiz')] array $userQuizzes,
    ): void {
        if (!$userService->isLogin()) {
            throw new UnauthorizedException('請先登入', 401);
        }

        $user = $userService->getCurrentUser();
        $segment = $orm->mustFindOne(Segment::class, ['id' => $segmentId]);
        $lesson = $orm->mustFindOne(Lesson::class, $segment->lessonId);

        if (!$lessonService->checkUserHasLesson($lesson->id, $user)) {
            throw new UnauthorizedException('無法作答', 400);
        }

        if (!$userQuizzes) {
            throw new UnauthorizedException('請先進行作答', 400);
        }

        $questions = $orm->from(Question::class)
            ->where('question.segment_id', $segment->id)
            ->order('question.ordering', 'ASC')
            ->all(Question::class);

        $userAnswers = [];
        $segmentScore = 0;

        /** @var Question $question */
        foreach ($questions as $question) {
            $qnInstance = $questionComposer->getQnInstance($question);

            $userAnswer = $orm->createEntity(UserAnswer::class);

            if (!array_key_exists($question->id, $userQuizzes)) {
                throw new \RuntimeException(
                    sprintf(
                        '題目 %s 尚未填答',
                        $question->ordering
                    )
                );
            }

            $value = $userQuizzes[$question->id];
            $isCorrect = $qnInstance->isAnswerCorrect($value);

            $userAnswer->userId = $user->id;
            $userAnswer->lessonId = $segment->lessonId;
            $userAnswer->quizId = $segment->id;
            $userAnswer->questionId = $question->id;
            $userAnswer->questionType = $question->type;
            $userAnswer->isCorrect = $isCorrect;
            $userAnswer->value = (array) $value;
            $userAnswer->score = $isCorrect ? $question->score : 0;

            $userAnswers[] = $userAnswer;

            $segmentScore += $isCorrect ? $question->score : 0;
        }

        $orm->saveMultiple(
            UserAnswer::class,
            $userAnswers,
            [
                'user_id',
                'question_id',
            ]
        );

        $map = $segmentAttender->attendToSegment(
            $user,
            $segment,
            modify: function (UserSegmentMap $map) use ($segmentScore) {
                $passed = BigDecimal::of($segmentScore)
                    ->isGreaterThanOrEqualTo(QuizSection::$defaultPassingScore);

                $map->score = $segmentScore;
                $map->status = $passed ? UserSegmentStatus::PASSED : UserSegmentStatus::FAILED;

                return $map;
            }
        );
    }

    /**
     * @throws \ReflectionException
     */
    #[Ajax]
    #[Method('GET')]
    public function getQuizQuestions(
        AppContext $app,
        ORM $orm,
    ): array {
        $segmentId = (int) $app->input('id');

        $questions = [];

        $prepareQuestions = $orm->from(Question::class)
            ->where('question.segment_id', $segmentId)
            ->order('question.ordering', 'ASC')
            ->all();

        foreach ($prepareQuestions as $question) {
            unset($question['answer']);

            $questions[] = $qn = $orm->toEntity(Question::class, $question);

            if ($qn->params['options'] ?? null) {
                foreach ($qn->params['options'] as &$option) {
                    unset($option['isAnswer']);
                }
            }
        }

        return compact(
            'questions',
        );
    }

    /**
     * @throws InvalidArgumentException
     * @throws \Exception
     */
    #[Ajax]
    #[Method('POST')]
    public function uploadHomework(
        AppContext $app,
        ORM $orm,
        UserService $userService,
        #[Inject(tag: 'image')]
        FileUploadService $fileUploadService,
        #[Service]
        ChronosService $chronosService,
    ): object {
        $item = $app->input('item');
        $file = $app->file('item')['homework_file'] ?? null;

        if (!$userService->isLogin()) {
            throw new UnauthorizedException('請先登入', 400);
        }

        $user = $userService->getCurrentUser();
        $segment = $orm->findOne(Segment::class, $item['segment_id']);

        if (!$segment) {
            throw new RouteNotFoundException('找不到這個章節');
        }

        $userSegmentMap = $orm->findOne(
            UserSegmentMap::class,
            [
                'user_id' => $user->id,
                'segment_id' => $segment->id,
                'lesson_id' => $segment->lessonId,
                'segment_type' => $segment->type,
                ['assignment', '!=', ''],
            ]
        );

        if ($userSegmentMap) {
            throw new ValidateFailException(['已繳交過作業']);
        }

        $assignment = $fileUploadService->handleFileIfUploaded(
            $file ?? null,
            'segment/' . $item['segment_id'] . '/homework/' . md5((string) $user->id) . '.{ext}'
        )?->getUri(true);

        $userSegmentMap = $orm->findOneOrCreate(
            UserSegmentMap::class,
            [
                'user_id' => $user->id,
                'segment_id' => $segment->id,
                'lesson_id' => $segment->lessonId,
                'segment_type' => $segment->type,
            ],
            [
                'status' => UserSegmentStatus::PENDING,
            ]
        );

        $userSegmentMap->description = $item['description'];
        $userSegmentMap->frontShow = (bool) $item['front_show'];

        if ($assignment) {
            $userSegmentMap->assignment = (string) $assignment;
            $userSegmentMap->assignmentUploadTime = $chronosService::create();
        }

        return $orm->updateOne(UserSegmentMap::class, $userSegmentMap, 'id');
    }
}
