<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Section;

use Lyrasoft\Melo\Data\SectionContent;
use Lyrasoft\Melo\Data\SectionMenuItem;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\MeloPackage;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Renderer\RendererService;
use Windwalker\DI\Attributes\Inject;
use Windwalker\Utilities\Contract\LanguageInterface;
use Windwalker\Utilities\Iterator\PriorityQueue;

abstract class AbstractSection
{
    #[Inject]
    protected RendererService $rendererService;

    abstract public static function id(): string;

    abstract public static function icon(): string;

    abstract public static function title(LanguageInterface $lang): string;

    abstract public static function description(LanguageInterface $lang): string;

    public static function adminVueComponentUrl(AssetService $asset): ?string
    {
        return null;
    }

    public static function adminVueComponentName(): ?string
    {
        return null;
    }

    public function __construct(
        public protected(set) Segment $data
    ) {
        //
    }

    public static function prepareEditView(AppContext $app): void
    {
        // Override to prepare data for edit view.
    }

    public function renderContent(RendererService $rendererService, SectionContent $sectionContent): string
    {
        $this->registerViewPaths($rendererService);

        try {
            return $rendererService->render(
                static::id() . '-content',
                [
                    'instance' => $this,
                    'content' => $sectionContent,
                ]
            );
        } catch (\Throwable $e) {
            if (str_contains($e->getMessage(), 'Unable to find layout')) {
                return $rendererService->render(
                    'melo.section.default-content',
                    [
                        'instance' => $this,
                        'content' => $sectionContent,
                    ]
                );
            }

            throw $e;
        }
    }

    public function renderSectionMenuItem(
        RendererService $rendererService,
        SectionMenuItem $sectionMenuItem,
    ): string {
        $this->registerViewPaths($rendererService);

        try {
            return $rendererService->render(
                static::id() . '-menu-item',
                [
                    'instance' => $this,
                    'menu' => $sectionMenuItem,
                ]
            );
        } catch (\Throwable $e) {
            if (str_contains($e->getMessage(), 'Unable to find layout')) {
                return $rendererService->render(
                    'melo.section.default-menu-item',
                    [
                        'instance' => $this,
                        'menu' => $sectionMenuItem,
                    ]
                );
            }

            throw $e;
        }
    }

    public function renderHiddenContent(
        RendererService $rendererService,
        SectionContent $sectionContent,
    ): string {
        $this->registerViewPaths($rendererService);

        try {
            return $rendererService->render(
                static::id() . '-hidden-content',
                [
                    'instance' => $this,
                    'content' => $sectionContent,
                ]
            );
        } catch (\Throwable $e) {
            if (str_contains($e->getMessage(), 'Unable to find layout')) {
                return $rendererService->render(
                    'melo.section.default-hidden-content',
                    [
                        'instance' => $this,
                        'content' => $sectionContent,
                    ]
                );
            }

            throw $e;
        }
    }

    /**
     * @param  RendererService  $rendererService
     *
     * @return  void
     */
    protected function registerViewPaths(RendererService $rendererService): void
    {
        $ref = new \ReflectionClass($this);
        $dir = dirname($ref->getFileName());

        $rendererService->addPath(
            $dir . '/views',
            PriorityQueue::LOW
        );

        $rendererService->addPath(
            MeloPackage::path('views/melo/section/' . static::id()),
            PriorityQueue::LOW
        );
    }
}
