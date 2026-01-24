<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Currency;

use Lyrasoft\Melo\MeloPackage;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\DI\Attributes\Service;

use function Lyrasoft\Melo\numberFormat;

#[Service]
class CurrencyFormatter
{
    public function __construct(protected MeloPackage $melo, protected ApplicationInterface $app)
    {
    }

    public function short(mixed $price): string
    {
        return $this->format($price, 'short');
    }

    public function full(mixed $price): string
    {
        return $this->format($price, 'full');
    }

    public function format(mixed $price, string $type = 'short'): string
    {
        $closure = $this->getPriceFormatter()[$type] ??= null;

        if (!$closure) {
            return numberFormat($price);
        }

        return $this->app->call(
            $closure,
            [
                $price,
                'price' => $price
            ],
            $this
        );
    }

    protected function getPriceFormatter(): array
    {
        return $this->melo->config('price_formatter') ?? [];
    }
}
