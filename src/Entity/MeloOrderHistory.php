<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Entity;

use Lyrasoft\Melo\Enum\OrderHistoryType;
use Lyrasoft\Melo\Enum\OrderState;
use Windwalker\ORM\Attributes\AutoIncrement;
use Windwalker\ORM\Attributes\Cast;
use Windwalker\Core\DateTime\Chronos;
use Windwalker\ORM\Attributes\CastNullable;
use Windwalker\Core\DateTime\ServerTimeCast;
use Windwalker\ORM\Attributes\CreatedTime;
use Lyrasoft\Luna\Attributes\Author;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\EntityInterface;
use Windwalker\ORM\EntityTrait;
use Windwalker\ORM\Metadata\EntityMetadata;

// phpcs:disable
// todo: remove this when phpcs supports 8.4
#[Table('melo_order_histories', 'order_history')]
#[\AllowDynamicProperties]
class MeloOrderHistory implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    public ?int $id = null;

    #[Column('order_id')]
    public int $orderId = 0;

    #[Column('type')]
    #[Cast(OrderHistoryType::class)]
    public OrderHistoryType $type {
        set(OrderHistoryType|string $value) => $this->type = OrderHistoryType::wrap($value);
    }

    #[Column('state')]
    #[Cast(OrderState::class)]
    public OrderState $state {
        set(OrderState|string $value) => $this->state = OrderState::wrap($value);
    }

    #[Column('notify')]
    #[Cast('bool', 'int')]
    public bool $notify = false;

    #[Column('message')]
    public string $message = '';

    #[Column('created')]
    #[CastNullable(ServerTimeCast::class)]
    #[CreatedTime]
    public ?Chronos $created = null {
        set(\DateTimeInterface|string|null $value) => $this->created = Chronos::tryWrap($value);
    }

    #[Column('created_by')]
    #[Author]
    public int $createdBy = 0;

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        //
    }
}
