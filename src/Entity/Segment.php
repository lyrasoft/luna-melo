<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Entity;

use Windwalker\Data\Collection;
use Windwalker\ORM\Attributes\AutoIncrement;
use Windwalker\ORM\Attributes\Cast;
use Unicorn\Enum\BasicState;
use Windwalker\Core\DateTime\Chronos;
use Windwalker\ORM\Attributes\CastNullable;
use Windwalker\Core\DateTime\ServerTimeCast;
use Windwalker\ORM\Attributes\CreatedTime;
use Lyrasoft\Luna\Attributes\Author;
use Windwalker\ORM\Attributes\CurrentTime;
use Lyrasoft\Luna\Attributes\Modifier;
use Windwalker\ORM\Cast\JsonCast;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\EntityInterface;
use Windwalker\ORM\EntityTrait;
use Windwalker\ORM\Event\AfterDeleteEvent;
use Windwalker\ORM\Metadata\EntityMetadata;

use function Windwalker\collect;

// phpcs:disable
// todo: remove this when phpcs supports 8.4

/**
 * @property-read  Segment[]  $children
 */
#[Table('segments', 'segment')]
#[\AllowDynamicProperties]
class Segment implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    public ?int $id = null;

    #[Column('lesson_id')]
    public int $lessonId = 0;

    #[Column('parent_id')]
    public int $parentId = 0;

    #[Column('type')]
    public string $type = '';

    #[Column('title')]
    public string $title = '';

    #[Column('content')]
    public string $content = '';

    #[Column('src')]
    public string $src = '';

    #[Column('filename')]
    public string $filename = '';

    #[Column('ext')]
    public string $ext = '';

    #[Column('caption_src')]
    public string $captionSrc = '';

    #[Column('duration')]
    public int $duration = 0;

    #[Column('can_skip')]
    #[Cast('bool', 'int')]
    public bool $canSkip = false;

    #[Column('preview')]
    #[Cast('bool', 'int')]
    public bool $preview = false;

    #[Column('state')]
    #[Cast('int')]
    #[Cast(BasicState::class)]
    public BasicState $state {
        set(BasicState|int $value) => $this->state = BasicState::wrap($value);
    }

    #[Column('ordering')]
    public int $ordering = 0;

    #[Column('created')]
    #[CastNullable(ServerTimeCast::class)]
    #[CreatedTime]
    public ?Chronos $created = null {
        set(\DateTimeInterface|string|null $value) => $this->created = Chronos::tryWrap($value);
    }

    #[Column('created_by')]
    #[Author]
    public int $createdBy = 0;

    #[Column('modified')]
    #[CastNullable(ServerTimeCast::class)]
    #[CurrentTime]
    public ?Chronos $modified = null {
        set(\DateTimeInterface|string|null $value) => $this->modified = Chronos::tryWrap($value);
    }

    #[Column('modified_by')]
    #[Modifier]
    public int $modifiedBy = 0;

    #[Column('params')]
    #[Cast(JsonCast::class)]
    public array $params = [];

    public Collection $children {
        get => $this->children ??= new Collection();
        set(iterable $value) => collect($value);
    }

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        //
    }

    #[AfterDeleteEvent]
    public static function afterDelete(AfterDeleteEvent $event): void
    {
        /** @var static $entity */
        $entity = $event->entity;
        $orm = $event->orm;

        $orm->deleteBatch(static::class, ['parent_id' => $entity->id]);
    }
}
