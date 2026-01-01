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

#[Table('melo_orders', 'order')]
#[\AllowDynamicProperties]
class Order implements EntityInterface
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
    public InvoiceType $invoiceType;

    #[Column('invoice_data')]
    #[Cast(JsonCast::class)]
    public array $invoiceData = [];

    #[Column('state')]
    #[Cast(OrderState::class)]
    public OrderState $state;

    #[Column('payment')]
    #[Cast(Payment::class)]
    public Payment $payment;

    #[Column('payment_no')]
    public string $paymentNo = '';

    #[Column('payment_data')]
    #[Cast(JsonCast::class)]
    public array $paymentData = [];

    #[Column('note')]
    public string $note = '';

    #[Column('paid_at')]
    #[CastNullable(ServerTimeCast::class)]
    public ?Chronos $paidAt = null;

    #[Column('cancelled_at')]
    #[CastNullable(ServerTimeCast::class)]
    public ?Chronos $cancelledAt = null;

    #[Column('expired_on')]
    #[CastNullable(ServerTimeCast::class)]
    public ?Chronos $expiredOn = null;

    #[Column('search_index')]
    public string $searchIndex = '';

    #[Column('created')]
    #[CastNullable(ServerTimeCast::class)]
    #[CreatedTime]
    public ?Chronos $created = null;

    #[Column('modified')]
    #[CastNullable(ServerTimeCast::class)]
    #[CurrentTime]
    public ?Chronos $modified = null;

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
