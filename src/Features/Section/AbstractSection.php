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
use Windwalker\Edge\Exception\LayoutNotFoundException;
use Windwalker\Renderer\CompositeRenderer;
use Windwalker\Utilities\Contract\LanguageInterface;
use Windwalker\Utilities\Iterator\PriorityQueue;

abstract class AbstractSection
{
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
        $renderer = $this->prepareRenderer($rendererService);

        try {
            return $renderer->render(
                static::id() . '-content',
                [
                    'instance' => $this,
                    'content' => $sectionContent,
                ]
            );
        } catch (LayoutNotFoundException $e) {
            return $renderer->render(
                'default-content',
                [
                    'instance' => $this,
                    'content' => $sectionContent,
                ]
            );
        }
    }

    public function renderSectionMenuItem(
        RendererService $rendererService,
        SectionMenuItem $sectionMenuItem,
    ): string {
        $renderer = $this->prepareRenderer($rendererService);

        try {
            return $renderer->render(
                static::id() . '-menu-item',
                [
                    'instance' => $this,
                    'menu' => $sectionMenuItem,
                ]
            );
        } catch (LayoutNotFoundException $e) {
            return $renderer->render(
                'default-menu-item',
                [
                    'instance' => $this,
                    'menu' => $sectionMenuItem,
                ]
            );
        }
    }

    public function renderHiddenContent(
        RendererService $rendererService,
        SectionContent $sectionContent,
    ): string {
        $renderer = $this->prepareRenderer($rendererService);

        try {
            return $renderer->render(
                static::id() . '-hidden-content',
                [
                    'instance' => $this,
                    'content' => $sectionContent,
                ]
            );
        } catch (LayoutNotFoundException $e) {
            return $renderer->render(
                'default-hidden-content',
                [
                    'instance' => $this,
                    'content' => $sectionContent,
                ]
            );
        }
    }

    protected function prepareRenderer(RendererService $rendererService): CompositeRenderer
    {
        /** @var CompositeRenderer $renderer */
        $renderer = $rendererService->createRenderer();

        $this->registerViewPaths($renderer);

        return $renderer;
    }

    protected function registerViewPaths(CompositeRenderer $renderer): void
    {
        $ref = new \ReflectionClass($this);
        $dir = dirname($ref->getFileName());

        $renderer->addPath(
            WINDWALKER_VIEWS . '/melo/section/' . static::id(),
            PriorityQueue::HIGH
        );

        $renderer->addPath(
            $dir . '/views',
            PriorityQueue::LOW
        );

        $renderer->addPath(
            MeloPackage::path('views/melo/section'),
            PriorityQueue::LOW
        );

        $renderer->addPath(
            MeloPackage::path('views/melo/section/' . static::id()),
            PriorityQueue::LOW
        );
    }
}
