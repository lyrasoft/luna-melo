<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Enum;

use Windwalker\Utilities\Enum\EnumRichInterface;
use Windwalker\Utilities\Enum\EnumRichTrait;

enum SectionCapacity implements EnumRichInterface
{
    use EnumRichTrait;

    case AVAILABLE;
    case PREVIEW;
    case LOGIN_REQUIRED;
    case NOT_YET_ATTENDED;
    case PROGRESS_LOCKED;

    protected function translateKey(string $name): string
    {
        return "app.enum.section.capacity.$name";
    }

    public function isAvailable(): bool
    {
        return $this === self::AVAILABLE || $this === self::PREVIEW;
    }
}
