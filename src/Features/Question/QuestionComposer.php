<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Question;

use Lyrasoft\Melo\Entity\Question;
use Lyrasoft\Melo\MeloPackage;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Database\ORMAwareTrait;
use Windwalker\DI\Attributes\Service;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

#[Service]
class QuestionComposer
{
    use ORMAwareTrait;
    use InstanceCacheTrait;

    public function __construct(protected ApplicationInterface $app, protected MeloPackage $melo)
    {
    }

    /**
     * @return  array<class-string<AbstractQuestion>>
     */
    public function getDefines(): array
    {
        return $this->once(
            'questions.defines',
            function () {
                $defines = [];

                foreach ($this->melo->config('questions.defines') ?? [] as $class) {
                    if (!is_a($class, AbstractQuestion::class, true)) {
                        throw new \RuntimeException(
                            sprintf(
                                'Question define class %s must be instance of %s',
                                $class,
                                AbstractQuestion::class
                            )
                        );
                    }

                    /** @var AbstractQuestion $class */
                    $defines[$class::id()] = $class;
                }

                return $defines;
            }
        );
    }

    public function getQnInstance(Question $question): AbstractQuestion
    {
        $defines = $this->getDefines();
        $qnDefine = $defines[$question->type] ?? null;

        if (!$qnDefine) {
            throw new \RuntimeException(
                sprintf(
                    'Question type %s not found. Available types: %s',
                    $question->type,
                    implode(', ', array_keys($defines))
                )
            );
        }

        return $this->app->make(
            $qnDefine,
            [
                Question::class => $question,
                'data' => $question
            ]
        );
    }
}
