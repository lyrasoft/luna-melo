<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Question;

use Lyrasoft\Melo\Data\Question\BaseQnParams;
use Lyrasoft\Melo\Entity\Question;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Data\RecordInterface;
use Windwalker\Utilities\Contract\LanguageInterface;

abstract class AbstractQuestion
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
        public protected(set) Question $data
    ) {
        //
    }

    public function getParams(): RecordInterface
    {
        return BaseQnParams::wrap($this->data->params);
    }
}
