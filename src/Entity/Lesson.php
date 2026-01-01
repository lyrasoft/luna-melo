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

// phpcs:disable
// todo: remove this when phpcs supports 8.4
#[Table('lessons', 'lesson')]
#[\AllowDynamicProperties]
class Lesson implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    public ?int $id = null;

    #[Column('category_id')]
    public int $categoryId = 0;

    #[Column('title')]
    public string $title = '';

    #[Column('alias')]
    #[Slugify]
    public string $alias = '';

    #[Column('teacher_id')]
    public int $teacherId = 0;

    #[Column('description')]
    public string $description = '';

    #[Column('acquired')]
    public string $acquired = '';

    #[Column('image')]
    public string $image = '';

    #[Column('state')]
    #[Cast('int')]
    #[Cast(BasicState::class)]
    public BasicState $state {
        set(BasicState|int $value) => $this->state = BasicState::wrap($value);
    }

    #[Column('start_date')]
    #[CastNullable(ServerTimeCast::class)]
    public ?Chronos $startDate = null {
        set(\DateTimeInterface|string|null $value) => $this->startDate = Chronos::tryWrap($value);
    }

    #[Column('end_date')]
    #[CastNullable(ServerTimeCast::class)]
    public ?Chronos $endDate = null {
        set(\DateTimeInterface|string|null $value) => $this->endDate = Chronos::tryWrap($value);
    }

    #[Column('is_step_by_step')]
    #[Cast('bool', 'int')]
    public bool $isStepByStep = false;

    #[Column('has_certificate')]
    #[Cast('bool', 'int')]
    public bool $hasCertificate = false;

    #[Column('price')]
    public float $price = 0.0;

    #[Column('special_price')]
    public float $specialPrice = 0.0;

    #[Column('is_special')]
    #[Cast('bool', 'int')]
    public bool $isSpecial = false;

    #[Column('is_free')]
    #[Cast('bool', 'int')]
    public bool $isFree = false;

    #[Column('pass_average_score')]
    public float $passAverageScore = 0.0;

    #[Column('pass_min_score')]
    public float $passMinScore = 0.0;

    #[Column('ordering')]
    public int $ordering = 0;

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

    #[Column('created_by')]
    #[Author]
    public int $createdBy = 0;

    #[Column('modified_by')]
    #[Modifier]
    public int $modifiedBy = 0;

    #[Column('params')]
    #[Cast(JsonCast::class)]
    public array $params = [];

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        //
    }
}
