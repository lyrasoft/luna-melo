<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Enum;

use Windwalker\Utilities\Attributes\Enum\Title;
use Windwalker\Utilities\Enum\EnumRichInterface;
use Windwalker\Utilities\Enum\EnumRichTrait;

enum SectionCapacity implements EnumRichInterface
{
    use EnumRichTrait;

    #[Title('可觀看')]
    case AVAILABLE;

    #[Title('可預覽')]
    case PREVIEW;

    #[Title('請先登入')]
    case LOGIN_REQUIRED;

    #[Title('尚未擁有此課程')]
    case NOT_YET_ATTENDED;

    #[Title('進度未達')]
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
