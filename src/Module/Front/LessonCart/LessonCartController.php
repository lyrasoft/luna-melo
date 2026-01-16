<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\LessonCart;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Cart\CartService;
use Lyrasoft\Melo\Cart\CartStorage;
use Lyrasoft\Melo\Data\AddressInfo;
use Lyrasoft\Melo\Data\CartData;
use Lyrasoft\Melo\Data\InvoiceData;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Enum\InvoiceType;
use Lyrasoft\Melo\Features\LessonCheckoutService;
use Psr\Container\ContainerExceptionInterface;
use Unicorn\Attributes\Ajax;
use Unicorn\Controller\AjaxControllerTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Router\Navigator;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;

#[Controller]
class LessonCartController
{
    use AjaxControllerTrait;

    #[Ajax]
    public function deleteItem(
        AppContext $app
    ): bool {
        $hash = $app->input('hash');

        $cartStorage = $app->service(CartStorage::class);

        $cartStorage->deleteItem($hash);

        return true;
    }

    #[Ajax]
    public function addToCart(
        AppContext $app,
    ): array {
        $id = (int) $app->input('id');

        $cartStorage = $app->service(CartStorage::class);

        $cartStorage->addItem($id);

        return array_values($cartStorage->getItems());
    }

    #[Ajax]
    public function getData(
        AppContext $app,
    ): CartData {
        $cartService = $app->service(CartService::class);

        return $cartService->getData();
    }
}
