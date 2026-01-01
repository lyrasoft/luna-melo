<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Entity;

use Windwalker\ORM\Attributes\AutoIncrement;
use Windwalker\ORM\Attributes\Cast;
use Windwalker\ORM\Cast\JsonCast;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\EntityInterface;
use Windwalker\ORM\EntityTrait;
use Windwalker\ORM\Metadata\EntityMetadata;

#[Table('melo_order_items', 'order_item')]
#[\AllowDynamicProperties]
class OrderItem implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    public ?int $id = null;

    #[Column('order_id')]
    public int $orderId = 0;

    #[Column('lesson_id')]
    public int $lessonId = 0;

    #[Column('title')]
    public string $title = '';

    #[Column('image')]
    public string $image = '';

    #[Column('lesson_data')]
    #[Cast(JsonCast::class)]
    public array $lessonData = [];

    #[Column('price')]
    public float $price = 0.0;

    #[Column('total')]
    public float $total = 0.0;

    #[Column('price_set')]
    #[Cast(JsonCast::class)]
    public array $priceSet = [];

    #[Column('options')]
    #[Cast(JsonCast::class)]
    public array $options = [];

    #[Column('params')]
    #[Cast(JsonCast::class)]
    public array $params = [];

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        //
    }
}
