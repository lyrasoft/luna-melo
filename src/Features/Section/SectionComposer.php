<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Section;

use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\MeloPackage;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Database\ORMAwareTrait;
use Windwalker\DI\Attributes\Service;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

#[Service]
class SectionComposer
{
    use ORMAwareTrait;
    use InstanceCacheTrait;

    public function __construct(protected MeloPackage $melo, protected ApplicationInterface $app)
    {
    }

    /**
     * @return  array<class-string<AbstractSection>>
     */
    public function getDefines(): array
    {
        return $this->once(
            'section.defines',
            function () {
                $defines = [];

                foreach ($this->melo->config('sections.defines') ?? [] as $class) {
                    if (!is_a($class, AbstractSection::class, true)) {
                        throw new \RuntimeException(
                            sprintf(
                                'Section define class %s must be instance of %s',
                                $class,
                                AbstractSection::class
                            )
                        );
                    }

                    /** @var AbstractSection $class */
                    $defines[$class::id()] = $class;
                }

                return $defines;
            }
        );
    }

    /**
     * @param  string|Segment  $section
     *
     * @return  class-string<AbstractSection>|null
     */
    public function getDefine(string|Segment $section): ?string
    {
        $type = $section instanceof Segment ? $section->type : $section;

        return $this->getDefines()[$type] ?? null;
    }

    /**
     * @param  string|Segment  $section
     *
     * @return  class-string<AbstractSection>
     */
    public function mustGetDefine(string|Segment $section): string
    {
        return $this->getDefine($section);
    }

    public function makeInstance(Segment $segment): AbstractSection
    {
        $className = $this->getDefine($segment);

        if (!$className) {
            throw new \RuntimeException(
                sprintf(
                    'Section define for type %s not found.',
                    $segment->type
                )
            );
        }

        return $this->app->make(
            $className,
            [
                'data' => $segment,
            ]
        );
    }
}
