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

#[Table('orders', 'order')]
#[\AllowDynamicProperties]
class Order implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    protected ?int $id = null;

    #[Column('user_id')]
    protected int $userId = 0;

    #[Column('no')]
    protected string $no = '';

    #[Column('total')]
    protected float $total = 0.0;

    #[Column('invoice_no')]
    protected string $invoiceNo = '';

    #[Column('invoice_type')]
    #[Cast(InvoiceType::class)]
    protected InvoiceType $invoiceType;

    #[Column('invoice_data')]
    #[Cast(JsonCast::class)]
    protected array $invoiceData = [];

    #[Column('state')]
    #[Cast(OrderState::class)]
    protected OrderState $state;

    #[Column('payment')]
    #[Cast(Payment::class)]
    protected Payment $payment;

    #[Column('payment_no')]
    protected string $paymentNo = '';

    #[Column('payment_data')]
    #[Cast(JsonCast::class)]
    protected array $paymentData = [];

    #[Column('note')]
    protected string $note = '';

    #[Column('paid_at')]
    #[CastNullable(ServerTimeCast::class)]
    protected ?Chronos $paidAt = null;

    #[Column('cancelled_at')]
    #[CastNullable(ServerTimeCast::class)]
    protected ?Chronos $cancelledAt = null;

    #[Column('expired_on')]
    #[CastNullable(ServerTimeCast::class)]
    protected ?Chronos $expiredOn = null;

    #[Column('search_index')]
    protected string $searchIndex = '';

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

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): static
    {
        $this->userId = $userId;

        return $this;
    }

    public function getNo(): string
    {
        return $this->no;
    }

    public function setNo(string $no): static
    {
        $this->no = $no;

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

    public function getInvoiceNo(): string
    {
        return $this->invoiceNo;
    }

    public function setInvoiceNo(string $invoiceNo): static
    {
        $this->invoiceNo = $invoiceNo;

        return $this;
    }

    public function getInvoiceType(): InvoiceType
    {
        return $this->invoiceType;
    }

    public function setInvoiceType(string|InvoiceType $invoiceType): static
    {
        $this->invoiceType = InvoiceType::wrap($invoiceType);

        return $this;
    }

    public function getInvoiceData(): array
    {
        return $this->invoiceData;
    }

    public function setInvoiceData(array $invoiceData): static
    {
        $this->invoiceData = $invoiceData;

        return $this;
    }

    public function getState(): OrderState
    {
        return $this->state;
    }

    public function setState(string|OrderState $state): static
    {
        $this->state = OrderState::wrap($state);

        return $this;
    }

    public function getPayment(): Payment
    {
        return $this->payment;
    }

    public function setPayment(string|Payment $payment): static
    {
        $this->payment = Payment::wrap($payment);

        return $this;
    }

    public function getPaymentData(): array
    {
        return $this->paymentData;
    }

    public function setPaymentData(array $paymentData): static
    {
        $this->paymentData = $paymentData;

        return $this;
    }

    public function getNote(): string
    {
        return $this->note;
    }

    public function setNote(string $note): static
    {
        $this->note = $note;

        return $this;
    }

    public function getPaidAt(): ?Chronos
    {
        return $this->paidAt;
    }

    public function setPaidAt(\DateTimeInterface|string|null $paidAt): static
    {
        $this->paidAt = Chronos::wrapOrNull($paidAt);

        return $this;
    }

    public function getCancelledAt(): ?Chronos
    {
        return $this->cancelledAt;
    }

    public function setCancelledAt(\DateTimeInterface|string|null $cancelledAt): static
    {
        $this->cancelledAt = Chronos::wrapOrNull($cancelledAt);

        return $this;
    }

    public function getExpiredOn(): ?Chronos
    {
        return $this->expiredOn;
    }

    public function setExpiredOn(\DateTimeInterface|string|null $expiredOn): static
    {
        $this->expiredOn = Chronos::wrapOrNull($expiredOn);

        return $this;
    }

    public function getSearchIndex(): string
    {
        return $this->searchIndex;
    }

    public function setSearchIndex(string $searchIndex): static
    {
        $this->searchIndex = $searchIndex;

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

    public function getPaymentNo(): string
    {
        return $this->paymentNo;
    }

    public function setPaymentNo(string $paymentNo): static
    {
        $this->paymentNo = $paymentNo;

        return $this;
    }
}
