<?php

/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2024 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Lesson;

use Lyrasoft\Melo\Entity\MeloOption;
use Lyrasoft\Melo\Entity\Question;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserAnswer;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\QuestionType;
use Lyrasoft\Melo\Enum\SegmentType;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\User\UserService;
use Psr\Cache\InvalidArgumentException;
use Unicorn\Attributes\Ajax;
use Unicorn\Controller\AjaxControllerTrait;
use Unicorn\Upload\FileUploadManager;
use Unicorn\Upload\FileUploadService;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\Method;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Form\Exception\ValidateFailException;
use Windwalker\DI\Attributes\Service;
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
            ->where('map.segment_type', SegmentType::HOMEWORK)
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
        $file = $app->file('homework_file');

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

        $ids = $questions->column('id')->dump();

        $optionGroup = $orm->from(MeloOption::class)
            ->where('question_id', $ids ?: [0])
            ->order('ordering', 'ASC')
            ->all(MeloOption::class)
            ->groupBy(fn(MeloOption $option) => $option->question_id ?? 0);

        $userAnswers = [];
        $segmentScore = 0;

        /** @var Question $question */
        foreach ($questions as $question) {
            $userAnswer = $orm->createEntity(UserAnswer::class);
            $isCorrect = false;
            $value = [];

            if ($question->type === QuestionType::BOOLEAN) {
                $isCorrect = (int) $userQuizzes[$question->id] === (int) $question->answer;
                $value = [$userQuizzes[$question->id]];
            }

            if ($question->type === QuestionType::SELECT) {
                foreach ($optionGroup[$question->id] as $option) {
                    if ($option->isAnswer) {
                        $isCorrect = (int) $userQuizzes[$question->id][0] === $option->getId();
                    }
                }
                $value = $userQuizzes[$question->id];
            }

            if ($question->type === QuestionType::MULTIPLE) {
                $corrects = [];

                foreach ($optionGroup[$question->id] as $option) {
                    if ($option->isAnswer) {
                        $corrects[] = in_array($option->getId(), $userQuizzes[$question->id], false);
                    } else {
                        $corrects[] = !in_array($option->getId(), $userQuizzes[$question->id], false);
                    }
                }

                $isCorrect = !in_array(false, $corrects, true);
                $value = $userQuizzes[$question->id];
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

        $ids = $prepareQuestions->column('id')->dump();

        $optionGroup = $orm->from(MeloOption::class)
            ->where('question_id', $ids ?: [0])
            ->order('ordering', 'ASC')
            ->all()
            ->groupBy('question_id');

        $optionsForQuestion = [];

        foreach ($optionGroup as $k => $options) {
            foreach ($options as $option) {
                unset($option['is_answer']);

                $option = $orm->toEntity(MeloOption::class, $option);

                $optionsForQuestion[$k][] = $option;
            }
        }

        return compact(
            'questions',
            'optionsForQuestion'
        );
    }
}
