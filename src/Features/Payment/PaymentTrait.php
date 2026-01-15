<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Payment;

use Lyrasoft\EventBooking\Entity\EventOrder;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\DI\Attributes\Inject;
use Windwalker\Utilities\Contract\LanguageInterface;

trait PaymentTrait
{
    protected string $title = '';

    #[Inject]
    protected Navigator $nav;

    public function getTaskEndpoint(EventOrder $order): RouteUri
    {
        return $this->nav->to('melo_payment_task')->id($order->id)->full();
    }

    public function getTitle(LanguageInterface $lang): string
    {
        return $this->title;
    }
}
