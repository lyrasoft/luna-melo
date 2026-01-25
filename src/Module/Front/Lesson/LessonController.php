<?php

/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2024 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Lesson;

use Lyrasoft\Melo\Entity\Question;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserAnswer;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Features\Question\Boolean\BooleanQuestion;
use Lyrasoft\Melo\Features\Question\MultiSelect\MultiSelectQuestion;
use Lyrasoft\Melo\Features\Question\QuestionComposer;
use Lyrasoft\Melo\Features\Question\Select\SelectQuestion;
use Lyrasoft\Melo\Features\Section\Homework\HomeworkSection;
use Lyrasoft\Melo\Features\Segment\SegmentFinder;
use Psr\Cache\InvalidArgumentException;
use Unicorn\Attributes\Ajax;
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
use Windwalker\DI\Attributes\Inject;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;

use function Windwalker\depth;

/**
 * The LessonController class.
 */
#[Controller()]
class LessonController
{
    use AjaxControllerTrait;

    #[Ajax]
    public function getSegment(
        SegmentFinder $segmentFinder,
        ORM $orm,
        UserService $userService,
        #[Input, Filter('int')] int $id
    ): Segment {
        $segment = $orm->mustFindOne(Segment::class, $id);

        $user = $userService->getUser();

        // if (!$segmentFinder->isAccessible($segment, $user)) {
        //     throw new ValidateFailException('您無權限查看此章節內容');
        // }

        return $segment;
    }

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
            ->order('map.id', 'ASC')
            ->limit($limit)
            ->offset($offset)
            ->groupByJoins()
            ->all(UserSegmentMap::class);
    }

    /**
     * @throws InvalidArgumentException
     * @throws \Exception
     */
    #[Ajax]
    #[Method('POST')]
    public function updateHomework(
        AppContext $app,
        ORM $orm,
        UserService $userService,
        #[Service(FileUploadManager::class, 'image')]
        FileUploadService $fileUploadService,
        #[Service]
        ChronosService $chronosService,
    ): object {
        $item = $app->input('item');
        $file = $app->file('item')['homework_file'] ?? null;

        if (!$userService->isLogin()) {
            throw new ValidateFailException('請先登入');
        }

        $user = $userService->getCurrentUser();
        $segment = $orm->findOne(Segment::class, $item['segment_id']);

        if (!$segment) {
            throw new ValidateFailException('找不到這個章節');
        }

        $userSegmentMap = $orm->findOne(
            UserSegmentMap::class,
            [
                'user_id' => $user->id,
                'segment_id' => $segment->id,
                'lesson_id' => $segment->lessonId,
                'segment_type' => $segment->type,
                [
                    'assignment',
                    '!=',
                    '',
                ],
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

    #[Ajax]
    #[Method('POST')]
    public function submitQuiz(
        AppContext $app,
        ORM $orm,
        UserService $userService,
        QuestionComposer $questionComposer,
    ): void {
        $item = $app->input('item');
        $segmentId = (int) $item['segment_id'];
        $userQuizzes = $item['quiz'] ?? null;

        if (!$userService->isLogin()) {
            throw new ValidateFailException('請先登入');
        }

        if (!$userQuizzes) {
            throw new ValidateFailException('請先進行作答');
        }

        $user = $userService->getCurrentUser();

        $segment = $orm->findOne(Segment::class, ['id' => $segmentId]);

        if (!$segment) {
            throw new ValidateFailException('找不到這個章節');
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
            $isCorrect = false;
            $value = [];

            if (!array_key_exists($question->id, $userQuizzes)) {
                throw new \RuntimeException(
                    sprintf(
                        '題目 %s 尚未填答',
                        $question->ordering
                    )
                );
            }

            if ($question->type === BooleanQuestion::id()) {
                $isCorrect = (int) $userQuizzes[$question->id] === (int) $question->answer;
                $value = [$userQuizzes[$question->id]];
            }

            if ($question->type === SelectQuestion::id()) {
                /** @var SelectQuestion $qnInstance */
                $options = $qnInstance->getParams()->options;
                
                foreach ($options as $option) {
                    if ($option->isAnswer) {
                        $isCorrect = (int) $userQuizzes[$question->id][0] === $option->id;
                    }
                }
                $value = $userQuizzes[$question->id];
            }

            if ($question->type === MultiSelectQuestion::id()) {
                /** @var MultiSelectQuestion $qnInstance */
                $options = $qnInstance->getParams()->options;
                $corrects = [];

                foreach ($options as $option) {
                    if ($option->isAnswer) {
                        $corrects[] = in_array($option->id, $userQuizzes[$question->id] ?? [], false);
                    } else {
                        $corrects[] = !in_array($option->id, $userQuizzes[$question->id] ?? [], false);
                    }
                }

                $isCorrect = !in_array(false, $corrects, true);
                $value = $userQuizzes[$question->id] ?? [];
            }

            $userAnswer->userId = $user->id;
            $userAnswer->lessonId = $segment->lessonId;
            $userAnswer->questionId = $question->id;
            $userAnswer->questionType = $question->type;
            $userAnswer->isCorrect = $isCorrect;
            $userAnswer->value = $value ?? [];
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

        $orm->updateOne(
            UserSegmentMap::class,
            [
                'user_id' => $user->id,
                'segment_id' => $segment->id,
                'score' => $segmentScore,
            ],
            [
                'user_id',
                'segment_id',
            ]
        );
    }

    /**
     * @throws \ReflectionException
     */
    #[Ajax]
    #[Method('GET')]
    public function prepareQuestionList(
        AppContext $app,
        ORM $orm,
    ): array {
        $segmentId = (int) $app->input('segment_id');

        $questions = [];

        $prepareQuestions = $orm->from(Question::class)
            ->where('question.segment_id', $segmentId)
            ->order('question.ordering', 'ASC')
            ->all();

        foreach ($prepareQuestions as $question) {
            unset($question['answer']);

            $questions[] = $orm->toEntity(Question::class, $question);
        }

        return compact(
            'questions',
        );
    }
}
