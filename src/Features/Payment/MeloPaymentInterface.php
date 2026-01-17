<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Payment;

use Lyrasoft\Melo\Data\CheckoutParams;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\ShopGo\Entity\OrderItem;
use Windwalker\Core\Application\AppContext;
use Windwalker\Utilities\Contract\LanguageInterface;

interface MeloPaymentInterface
{
    public static function getId(): string;

    public static function getTypeTitle(LanguageInterface $lang): string;

    public static function getDescription(LanguageInterface $lang): string;

    public function getTitle(LanguageInterface $lang): string;

    public function process(CheckoutParams $params): mixed;

    /**
     * @param  MeloOrder  $order
     * @param  iterable<OrderItem>   $items
     *
     * @return  string
     */
    public function orderInfo(MeloOrder $order, iterable $items): string;

    public function runTask(AppContext $app, MeloOrder $order, string $task): mixed;

    public function isTest(): bool;

    public function toArray(LanguageInterface $lang): array;
}
