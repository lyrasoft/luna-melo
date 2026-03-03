<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Payment;

use Lyrasoft\Melo\Entity\MeloOrder;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\RouteUri;
use Windwalker\DI\Attributes\Inject;
use Windwalker\Utilities\Contract\LanguageInterface;

trait PaymentTrait
{
    protected string $title = '';

    #[Inject]
    protected Navigator $nav;

    public protected(set) array $params = [];

    public function getTaskEndpoint(MeloOrder $order): RouteUri
    {
        return $this->nav->to('melo_payment_task')->id($order->id)->full();
    }

    public function getTitle(LanguageInterface $lang): string
    {
        return $this->title;
    }

    public function getParams(): array
    {
        return $this->params;
    }

    public function toArray(LanguageInterface $lang): array
    {
        return [
            'id' => static::getId(),
            'typeTitle' => static::getTypeTitle($lang),
            'title' => $this->getTitle($lang),
            'description' => static::getDescription($lang),
            'params' => $this->getParams()
        ];
    }
}
