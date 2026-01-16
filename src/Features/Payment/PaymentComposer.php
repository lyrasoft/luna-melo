<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Payment;

use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\MeloPackage;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Service;
use Windwalker\Utilities\Cache\InstanceCacheTrait;

use function Windwalker\collect;

#[Service]
class PaymentComposer
{
    use InstanceCacheTrait;

    public function __construct(protected ApplicationInterface $app, protected MeloPackage $melo)
    {
    }

    public function getGateway(string $alias): ?MeloPaymentInterface
    {
        return $this->getGateways()[$alias] ?? null;
    }

    /**
     * @return  Collection<MeloPaymentInterface>
     */
    public function getGateways(bool $refresh = false): Collection
    {
        return $this->once(
            'gateways',
            function () {
                $gateways = (array) $this->melo->config('payment.gateways');

                foreach ($gateways as $i => $gateway) {
                    $gateways[$i] = $this->app->resolve($gateway);
                }

                return collect($gateways);
            },
            $refresh
        );
    }

    public function createNo(MeloOrder $order, bool $test = false): string
    {
        $handler = $this->melo->config('payment.no_handler');

        if (!$handler instanceof \Closure) {
            throw new \LogicException('Payment NO handler is not closure');
        }

        return $this->app->call(
            $handler,
            [
                'order' => $order,
                MeloOrder::class => $order,
                'test' => $test,
            ]
        );
    }
}
