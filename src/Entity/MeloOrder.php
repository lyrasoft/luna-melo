<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Entity;

use Lyrasoft\Melo\Enum\InvoiceType;
use Lyrasoft\Melo\Enum\OrderState;
use Lyrasoft\Melo\Enum\Payment;
use Windwalker\ORM\Attributes\AutoIncrement;
use Windwalker\ORM\Attributes\Cast;
use Windwalker\ORM\Cast\JsonCast;
use Windwalker\Core\DateTime\Chronos;
use Windwalker\ORM\Attributes\CastNullable;
use Windwalker\Core\DateTime\ServerTimeCast;
use Windwalker\ORM\Attributes\CreatedTime;
use Windwalker\ORM\Attributes\CurrentTime;
use Lyrasoft\Luna\Attributes\Author;
use Lyrasoft\Luna\Attributes\Modifier;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\EntityInterface;
use Windwalker\ORM\EntityTrait;
use Windwalker\ORM\Metadata\EntityMetadata;

// phpcs:disable
// todo: remove this when phpcs supports 8.4
#[Table('melo_orders', 'order')]
#[\AllowDynamicProperties]
class MeloOrder implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    public ?int $id = null;

    #[Column('user_id')]
    public int $userId = 0;

    #[Column('no')]
    public string $no = '';

    #[Column('total')]
    public float $total = 0.0;

    #[Column('invoice_no')]
    public string $invoiceNo = '';

    #[Column('invoice_type')]
    #[Cast(InvoiceType::class)]
    public InvoiceType $invoiceType {
        set(InvoiceType|string $value) => $this->invoiceType = InvoiceType::wrap($value);
    }

    #[Column('invoice_data')]
    #[Cast(JsonCast::class)]
    public array $invoiceData = [];

    #[Column('state')]
    #[Cast(OrderState::class)]
    public OrderState $state {
        set(OrderState|string $value) => $this->state = OrderState::wrap($value);
    }

    #[Column('payment')]
    #[Cast(Payment::class)]
    public Payment $payment {
        set(Payment|string $value) => $this->payment = Payment::wrap($value);
    }

    #[Column('payment_no')]
    public string $paymentNo = '';

    #[Column('payment_data')]
    #[Cast(JsonCast::class)]
    public array $paymentData = [];

    #[Column('note')]
    public string $note = '';

    #[Column('paid_at')]
    #[CastNullable(ServerTimeCast::class)]
    public ?Chronos $paidAt = null {
        set(\DateTimeInterface|string|null $value) => $this->paidAt = Chronos::tryWrap($value);
    }

    #[Column('cancelled_at')]
    #[CastNullable(ServerTimeCast::class)]
    public ?Chronos $cancelledAt = null {
        set(\DateTimeInterface|string|null $value) => $this->cancelledAt = Chronos::tryWrap($value);
    }

    #[Column('expired_on')]
    #[CastNullable(ServerTimeCast::class)]
    public ?Chronos $expiredOn = null {
        set(\DateTimeInterface|string|null $value) => $this->expiredOn = Chronos::tryWrap($value);
    }

    #[Column('search_index')]
    public string $searchIndex = '';

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
