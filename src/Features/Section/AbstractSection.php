<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Section;

use Lyrasoft\Melo\Entity\Segment;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Utilities\Contract\LanguageInterface;

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
}
