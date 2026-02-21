<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Quiz;

use Brick\Math\BigDecimal;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Question;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserAnswer;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Lyrasoft\Melo\Features\LessonService;
use Lyrasoft\Melo\Features\Question\QuestionComposer;
use Lyrasoft\Melo\Features\Section\Quiz\QuizSection;
use Lyrasoft\Melo\Features\Segment\SegmentAttender;
use Unicorn\Attributes\Ajax;
use Unicorn\Controller\AjaxControllerTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\Filter;
use Windwalker\Core\Attributes\Method;
use Windwalker\Core\Attributes\Request\Input;
use Windwalker\Core\Security\Exception\UnauthorizedException;
use Windwalker\ORM\ORM;

#[Controller]
class HomeworkController
{
    use AjaxControllerTrait;

    #[Ajax]
    #[Method('POST')]
    public function submit(
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
    public function prepareQuestionList(
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
}
