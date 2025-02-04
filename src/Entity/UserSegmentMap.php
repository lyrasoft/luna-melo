<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Entity;

use Lyrasoft\Melo\Enum\SegmentType;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Lyrasoft\Melo\Workflow\HomeworkStatusWorkflow;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\Attributes\AutoIncrement;
use Windwalker\ORM\Attributes\Cast;
use Windwalker\Core\DateTime\Chronos;
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

#[Table('user_segment_maps', 'user_segment_map')]
#[\AllowDynamicProperties]
class UserSegmentMap implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    protected ?int $id = null;

    #[Column('user_id')]
    protected int $userId = 0;

    #[Column('lesson_id')]
    protected int $lessonId = 0;

    #[Column('segment_id')]
    protected int $segmentId = 0;

    #[Column('segment_type')]
    #[Cast(SegmentType::class)]
    protected SegmentType $segmentType;

    #[Column('status')]
    #[Cast(UserSegmentStatus::class)]
    protected UserSegmentStatus $status;

    #[Column('description')]
    protected string $description = '';

    #[Column('score')]
    protected int $score = 0;

    #[Column('assignment')]
    protected string $assignment = '';

    #[Column('assignment_upload_time')]
    #[CastNullable(ServerTimeCast::class)]
    protected ?Chronos $assignmentUploadTime = null;

    #[Column('front_show')]
    #[Cast('bool', 'int')]
    protected bool $frontShow = false;

    #[Column('created')]
    #[CastNullable(ServerTimeCast::class)]
    #[CreatedTime]
    protected ?Chronos $created = null;

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata, #[Autowire] HomeworkStatusWorkflow $workflow): void
    {
        $workflow->listen($metadata);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): static
    {
        $this->userId = $userId;

        return $this;
    }

    public function getLessonId(): int
    {
        return $this->lessonId;
    }

    public function setLessonId(int $lessonId): static
    {
        $this->lessonId = $lessonId;

        return $this;
    }

    public function getSegmentId(): int
    {
        return $this->segmentId;
    }

    public function setSegmentId(int $segmentId): static
    {
        $this->segmentId = $segmentId;

        return $this;
    }

    public function getSegmentType(): SegmentType
    {
        return $this->segmentType;
    }

    public function setSegmentType(string|SegmentType $segmentType): static
    {
        $this->segmentType = SegmentType::wrap($segmentType);

        return $this;
    }

    public function getStatus(): UserSegmentStatus
    {
        return $this->status;
    }

    public function setStatus(string|UserSegmentStatus $status): static
    {
        $this->status = UserSegmentStatus::wrap($status);

        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getScore(): int
    {
        return $this->score;
    }

    public function setScore(int $score): static
    {
        $this->score = $score;

        return $this;
    }

    public function getAssignment(): string
    {
        return $this->assignment;
    }

    public function setAssignment(string $assignment): static
    {
        $this->assignment = $assignment;

        return $this;
    }

    public function isFrontShow(): bool
    {
        return $this->frontShow;
    }

    public function setFrontShow(bool $frontShow): static
    {
        $this->frontShow = $frontShow;

        return $this;
    }

    public function getCreated(): ?Chronos
    {
        return $this->created;
    }

    public function setCreated(\DateTimeInterface|string|null $created): static
    {
        $this->created = Chronos::wrapOrNull($created);

        return $this;
    }

    public function getAssignmentUploadTime(): ?Chronos
    {
        return $this->assignmentUploadTime;
    }

    public function setAssignmentUploadTime(\DateTimeInterface|string|null $assignmentUploadTime): static
    {
        $this->assignmentUploadTime = Chronos::wrapOrNull($assignmentUploadTime);

        return $this;
    }
}
