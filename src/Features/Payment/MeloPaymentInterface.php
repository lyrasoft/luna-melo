<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Payment;

use Lyrasoft\Melo\Data\CheckoutParams;
use Lyrasoft\Melo\Entity\MeloOrder;
use Windwalker\Core\Application\AppContext;
use Windwalker\Utilities\Contract\LanguageInterface;

interface MeloPaymentInterface
{
    public static function getId(): string;

    public static function getTypeTitle(LanguageInterface $lang): string;

    public static function getDescription(LanguageInterface $lang): string;

    public function getTitle(LanguageInterface $lang): string;

    public function process(CheckoutParams $params): mixed;

    public function orderInfo(MeloOrder $order, iterable $attends): string;

    public function runTask(AppContext $app, MeloOrder $order, string $task): mixed;

    public function isTest(): bool;

    public function toArray(LanguageInterface $lang): array;
}
