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

#[Table('melo_order_histories', 'order_history')]
#[\AllowDynamicProperties]
class OrderHistory implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    public ?int $id = null;

    #[Column('order_id')]
    public int $orderId = 0;

    #[Column('type')]
    #[Cast(OrderHistoryType::class)]
    public OrderHistoryType $type;

    #[Column('state')]
    #[Cast(OrderState::class)]
    public OrderState $state;

    #[Column('notify')]
    #[Cast('bool', 'int')]
    public bool $notify = false;

    #[Column('message')]
    public string $message = '';

    #[Column('created')]
    #[CastNullable(ServerTimeCast::class)]
    #[CreatedTime]
    public ?Chronos $created = null;

    #[Column('created_by')]
    #[Author]
    public int $createdBy = 0;

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        //
    }
}
