<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Entity;

use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Lyrasoft\Melo\Workflow\HomeworkStatusWorkflow;
use Windwalker\Core\DateTime\Chronos;
use Windwalker\Core\DateTime\ServerTimeCast;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\Attributes\AutoIncrement;
use Windwalker\ORM\Attributes\Cast;
use Windwalker\ORM\Attributes\CastNullable;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\CreatedTime;
use Windwalker\ORM\Attributes\CurrentTime;
use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Attributes\JsonObject;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\EntityInterface;
use Windwalker\ORM\EntityTrait;
use Windwalker\ORM\Metadata\EntityMetadata;

// phpcs:disable
// todo: remove this when phpcs supports 8.4
#[Table('user_segment_maps', 'user_segment_map')]
#[\AllowDynamicProperties]
class UserSegmentMap implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    public ?int $id = null;

    #[Column('user_id')]
    public int $userId = 0;

    #[Column('lesson_id')]
    public int $lessonId = 0;

    #[Column('segment_id')]
    public int $segmentId = 0;

    #[Column('segment_type')]
    public string $segmentType = '';

    #[Column('status')]
    #[Cast(UserSegmentStatus::class)]
    public UserSegmentStatus $status {
        set(UserSegmentStatus|string $value) => $this->status = UserSegmentStatus::wrap($value);
    }

    #[Column('description')]
    public string $description = '';

    #[Column('score')]
    public float $score = 0;

    #[Column('assignment')]
    public string $assignment = '';

    #[Column('assignment_upload_time')]
    #[CastNullable(ServerTimeCast::class)]
    public ?Chronos $assignmentUploadTime = null {
        set(\DateTimeInterface|string|null $value) => $this->assignmentUploadTime = Chronos::tryWrap($value);
    }

    #[Column('front_show')]
    #[Cast('bool', 'int')]
    public bool $frontShow = false;

    #[Column('details')]
    #[JsonObject]
    public array $details = [];

    #[Column('created')]
    #[CastNullable(ServerTimeCast::class)]
    #[CreatedTime]
    public ?Chronos $created = null {
        set(\DateTimeInterface|string|null $value) => $this->created = Chronos::tryWrap($value);
    }

    #[Column('modified')]
    #[CastNullable(ServerTimeCast::class)]
    #[CurrentTime]
    public ?Chronos $modified = null {
        set(\DateTimeInterface|string|null $value) => $this->modified = Chronos::tryWrap($value);
    }

    #[Column('params')]
    #[JsonObject]
    public array $params = [];

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata, #[Autowire] HomeworkStatusWorkflow $workflow): void
    {
        $workflow->listen($metadata);
    }
}
