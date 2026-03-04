<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Entity;

use Lyrasoft\Melo\Enum\UserLessonStatus;
use Windwalker\ORM\Attributes\AutoIncrement;
use Windwalker\Core\DateTime\Chronos;
use Windwalker\ORM\Attributes\Cast;
use Windwalker\ORM\Attributes\CastNullable;
use Windwalker\Core\DateTime\ServerTimeCast;
use Windwalker\ORM\Attributes\CreatedTime;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\EntityInterface;
use Windwalker\ORM\EntityTrait;
use Windwalker\ORM\Metadata\EntityMetadata;

// phpcs:disable
// todo: remove this when phpcs supports 8.4
#[Table('user_lesson_maps', 'user_lesson_map')]
#[\AllowDynamicProperties]
class UserLessonMap implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    public ?int $id = null;

    #[Column('user_id')]
    public int $userId = 0;

    #[Column('lesson_id')]
    public int $lessonId = 0;

    #[Column('progress')]
    public float $progress = 0.0;

    #[Column('status')]
    #[Cast(UserLessonStatus::class)]
    public UserLessonStatus $status {
        set(UserLessonStatus|string $value) => $this->status = UserLessonStatus::wrap($value);
    }

    #[Column('created')]
    #[CastNullable(ServerTimeCast::class)]
    #[CreatedTime]
    public ?Chronos $created = null {
        set(\DateTimeInterface|string|null $value) => $this->created = Chronos::tryWrap($value);
    }

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        //
    }
}
