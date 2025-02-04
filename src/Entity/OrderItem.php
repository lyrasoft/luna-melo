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

#[Table('order_items', 'order_item')]
#[\AllowDynamicProperties]
class OrderItem implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    protected ?int $id = null;

    #[Column('order_id')]
    protected int $orderId = 0;

    #[Column('lesson_id')]
    protected int $lessonId = 0;

    #[Column('title')]
    protected string $title = '';

    #[Column('image')]
    protected string $image = '';

    #[Column('lesson_data')]
    #[Cast(JsonCast::class)]
    protected array $lessonData = [];

    #[Column('price')]
    protected float $price = 0.0;

    #[Column('total')]
    protected float $total = 0.0;

    #[Column('price_set')]
    #[Cast(JsonCast::class)]
    protected array $priceSet = [];

    #[Column('options')]
    #[Cast(JsonCast::class)]
    protected array $options = [];

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

    public function getOrderId(): int
    {
        return $this->orderId;
    }

    public function setOrderId(int $orderId): static
    {
        $this->orderId = $orderId;

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

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

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

    public function getLessonData(): array
    {
        return $this->lessonData;
    }

    public function setLessonData(array $lessonData): static
    {
        $this->lessonData = $lessonData;

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

    public function getTotal(): float
    {
        return $this->total;
    }

    public function setTotal(float $total): static
    {
        $this->total = $total;

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

    public function getPriceSet(): array
    {
        return $this->priceSet;
    }

    public function setPriceSet(array $priceSet): static
    {
        $this->priceSet = $priceSet;

        return $this;
    }

    public function getOptions(): array
    {
        return $this->options;
    }

    public function setOptions(array $options): static
    {
        $this->options = $options;

        return $this;
    }
}
