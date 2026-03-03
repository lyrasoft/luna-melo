<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Payment;

use Lyrasoft\Melo\Data\CheckoutParams;
use Lyrasoft\Melo\Entity\MeloOrder;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Utilities\Contract\LanguageInterface;

class TransferPayment implements MeloPaymentInterface
{
    use PaymentTrait;

    public function __construct(
        protected ApplicationInterface $app,
        protected ?\Closure $renderHandler,
        string $title = '',
        array $params = [],
        public bool $test = false,
    ) {
        $this->title = $title;
        $this->params = $params;
    }

    public static function getId(): string
    {
        return 'transfer';
    }

    public static function getTypeTitle(LanguageInterface $lang): string
    {
        return '轉帳付款';
    }

    public function getTitle(LanguageInterface $lang): string
    {
        return $this->title ?: '轉帳付款';
    }

    public static function getDescription(LanguageInterface $lang): string
    {
        return '顯示銀行帳號，轉帳支付';
    }

    public function process(CheckoutParams $params): mixed
    {
        return null;
    }

    public function runTask(AppContext $app, MeloOrder $order, string $task): mixed
    {
        return '';
    }

    public function getRenderHandler(): ?\Closure
    {
        return $this->renderHandler;
    }

    public function setRenderHandler(?\Closure $renderHandler): static
    {
        $this->renderHandler = $renderHandler;

        return $this;
    }

    public function orderInfo(MeloOrder $order, iterable $items): string
    {
        $handler = $this->getRenderHandler();

        if (!$handler) {
            return '';
        }

        return $this->app->call(
            $handler,
            [
                MeloOrder::class => $order,
                'order' => $order,
                'attends' => $items,
            ]
        );
    }

    public function createTransactionNo(MeloOrder $order): string
    {
        return '';
    }

    public function isTest(): bool
    {
        return $this->test;
    }
}
