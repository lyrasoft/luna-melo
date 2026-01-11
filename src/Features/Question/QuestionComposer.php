<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Question;

use Lyrasoft\Melo\MeloPackage;
use Windwalker\Core\Database\ORMAwareTrait;
use Windwalker\DI\Attributes\Service;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

#[Service]
class QuestionComposer
{
    use ORMAwareTrait;
    use InstanceCacheTrait;

    public function __construct(protected MeloPackage $melo)
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
}
