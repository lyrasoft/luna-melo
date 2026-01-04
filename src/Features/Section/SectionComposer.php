<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Section;

use Lyrasoft\Melo\MeloPackage;
use Windwalker\Core\Database\ORMAwareTrait;
use Windwalker\DI\Attributes\Service;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

#[Service]
class SectionComposer
{
    use ORMAwareTrait;
    use InstanceCacheTrait;

    public function __construct(protected MeloPackage $melo)
    {
    }

    /**
     * @return  array<class-string<AbstractSectionDefine>>
     */
    public function getSectionDefines(): array
    {
        return $this->once(
            'section.defines',
            function () {
                $defines = [];

                foreach ($this->melo->config('sections.defines') ?? [] as $class) {
                    if (!is_a($class, AbstractSectionDefine::class, true)) {
                        throw new \RuntimeException(
                            sprintf(
                                'Section define class %s must be instance of %s',
                                $class,
                                AbstractSectionDefine::class
                            )
                        );
                    }

                    /** @var AbstractSectionDefine $class */
                    $defines[$class::id()] = $class;
                }

                return $defines;
            }
        );
    }
}
