<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Entity;

use Windwalker\ORM\Attributes\AutoIncrement;
use Lyrasoft\Luna\Attributes\Slugify;
use Unicorn\Enum\BasicState;
use Windwalker\ORM\Attributes\Cast;
use Windwalker\Core\DateTime\Chronos;
use Windwalker\ORM\Attributes\CastNullable;
use Windwalker\Core\DateTime\ServerTimeCast;
use Windwalker\ORM\Attributes\CreatedTime;
use Windwalker\ORM\Attributes\CurrentTime;
use Lyrasoft\Luna\Attributes\Author;
use Lyrasoft\Luna\Attributes\Modifier;
use Windwalker\ORM\Cast\JsonCast;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\EntityInterface;
use Windwalker\ORM\EntityTrait;
use Windwalker\ORM\Metadata\EntityMetadata;

#[Table('lessons', 'lesson')]
#[\AllowDynamicProperties]
class Lesson implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    protected ?int $id = null;

    #[Column('category_id')]
    protected int $categoryId = 0;

    #[Column('title')]
    protected string $title = '';

    #[Column('alias')]
    #[Slugify]
    protected string $alias = '';

    #[Column('teacher_id')]
    protected int $teacherId = 0;

    #[Column('description')]
    protected string $description = '';

    #[Column('acquired')]
    protected string $acquired = '';

    #[Column('image')]
    protected string $image = '';

    #[Column('state')]
    #[Cast('int')]
    #[Cast(BasicState::class)]
    protected BasicState $state;

    #[Column('start_date')]
    #[CastNullable(ServerTimeCast::class)]
    protected ?Chronos $startDate = null;

    #[Column('end_date')]
    #[CastNullable(ServerTimeCast::class)]
    protected ?Chronos $endDate = null;

    #[Column('is_step_by_step')]
    #[Cast('bool', 'int')]
    protected bool $isStepByStep = false;

    #[Column('has_certificate')]
    #[Cast('bool', 'int')]
    protected bool $hasCertificate = false;

    #[Column('price')]
    protected float $price = 0.0;

    #[Column('special_price')]
    protected float $specialPrice = 0.0;

    #[Column('is_special')]
    #[Cast('bool', 'int')]
    protected bool $isSpecial = false;

    #[Column('is_free')]
    #[Cast('bool', 'int')]
    protected bool $isFree = false;

    #[Column('pass_average_score')]
    protected float $passAverageScore = 0.0;

    #[Column('pass_min_score')]
    protected float $passMinScore = 0.0;

    #[Column('ordering')]
    protected int $ordering = 0;

    #[Column('created')]
    #[CastNullable(ServerTimeCast::class)]
    #[CreatedTime]
    protected ?Chronos $created = null;

    #[Column('modified')]
    #[CastNullable(ServerTimeCast::class)]
    #[CurrentTime]
    protected ?Chronos $modified = null;

    #[Column('created_by')]
    #[Author]
    protected int $createdBy = 0;

    #[Column('modified_by')]
    #[Modifier]
    protected int $modifiedBy = 0;

    #[Column('params')]
    #[Cast(JsonCast::class)]
    protected array $params = [];

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        //
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

    public function getCategoryId(): int
    {
        return $this->categoryId;
    }

    public function setCategoryId(int $categoryId): static
    {
        $this->categoryId = $categoryId;

        return $this;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getTeacherId(): int
    {
        return $this->teacherId;
    }

    public function setTeacherId(int $teacherId): static
    {
        $this->teacherId = $teacherId;

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

    public function getAcquired(): string
    {
        return $this->acquired;
    }

    public function setAcquired(string $acquired): static
    {
        $this->acquired = $acquired;

        return $this;
    }

    public function getImage(): string
    {
        return $this->image;
    }

    public function setImage(string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getState(): BasicState
    {
        return $this->state;
    }

    public function setState(int|BasicState $state): static
    {
        $this->state = BasicState::wrap($state);

        return $this;
    }

    public function getStartDate(): ?Chronos
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface|string|null $startDate): static
    {
        $this->startDate = Chronos::wrapOrNull($startDate);

        return $this;
    }

    public function getEndDate(): ?Chronos
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface|string|null $endDate): static
    {
        $this->endDate = Chronos::wrapOrNull($endDate);

        return $this;
    }

    public function isStepByStep(): bool
    {
        return $this->isStepByStep;
    }

    public function setIsStepByStep(bool $isStepByStep): static
    {
        $this->isStepByStep = $isStepByStep;

        return $this;
    }

    public function isHasCertificate(): bool
    {
        return $this->hasCertificate;
    }

    public function setHasCertificate(bool $hasCertificate): static
    {
        $this->hasCertificate = $hasCertificate;

        return $this;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getSpecialPrice(): float
    {
        return $this->specialPrice;
    }

    public function setSpecialPrice(float $specialPrice): static
    {
        $this->specialPrice = $specialPrice;

        return $this;
    }

    public function isSpecial(): bool
    {
        return $this->isSpecial;
    }

    public function setIsSpecial(bool $isSpecial): static
    {
        $this->isSpecial = $isSpecial;

        return $this;
    }

    public function isFree(): bool
    {
        return $this->isFree;
    }

    public function setIsFree(bool $isFree): static
    {
        $this->isFree = $isFree;

        return $this;
    }

    public function getPassAverageScore(): float
    {
        return $this->passAverageScore;
    }

    public function setPassAverageScore(float $passAverageScore): static
    {
        $this->passAverageScore = $passAverageScore;

        return $this;
    }

    public function getPassMinScore(): float
    {
        return $this->passMinScore;
    }

    public function setPassMinScore(float $passMinScore): static
    {
        $this->passMinScore = $passMinScore;

        return $this;
    }

    public function getOrdering(): int
    {
        return $this->ordering;
    }

    public function setOrdering(int $ordering): static
    {
        $this->ordering = $ordering;

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

    public function getModified(): ?Chronos
    {
        return $this->modified;
    }

    public function setModified(\DateTimeInterface|string|null $modified): static
    {
        $this->modified = Chronos::wrapOrNull($modified);

        return $this;
    }

    public function getCreatedBy(): int
    {
        return $this->createdBy;
    }

    public function setCreatedBy(int $createdBy): static
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getModifiedBy(): int
    {
        return $this->modifiedBy;
    }

    public function setModifiedBy(int $modifiedBy): static
    {
        $this->modifiedBy = $modifiedBy;

        return $this;
    }

    public function getParams(): array
    {
        return $this->params;
    }

    public function setParams(array $params): static
    {
        $this->params = $params;

        return $this;
    }

    public function getAlias(): string
    {
        return $this->alias;
    }

    public function setAlias(string $alias): static
    {
        $this->alias = $alias;

        return $this;
    }
}
