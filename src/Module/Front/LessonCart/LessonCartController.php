<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\LessonCart;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Cart\CartService;
use Lyrasoft\Melo\Cart\CartStorage;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Features\CheckoutService;
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
    ): array {
        $cartService = $app->service(CartService::class);

        return $cartService->getData();
    }

    public function checkout(
        AppContext $app,
        ORM $orm,
        Navigator $nav,
        UserService $userService,
        #[Service]
        CartService $cartService,
        #[Service]
        CheckoutService $checkoutService,
        #[Service]
        CartStorage $cartStorage,
    ) {
        $input = (array) $app->input('checkout');

        $app->state->remember('checkout.data', $input);

        /** @var User $user */
        $user = $userService->getUser();

        if (!$user->isLogin()) {
            return $nav->to('melo_cart');
        }

        /**
         * @var MeloOrder $order
         */
        [$order, $cartData] = (array) $orm->getDb()->transaction(
            function () use ($input, $cartService, $user, $checkoutService) {
                $order = new MeloOrder();

                $invoiceData = [
                    'invoice_title' => $input['invoice_title'],
                    'invoice_vat' => $input['invoice_vat'],
                    'invoice_name' => $input['invoice_name'],
                    'address' => [
                        'zip' => $input['zip'],
                        'city' => $input['city'],
                        'dist' => $input['dist'],
                        'address' => $input['address'],
                    ],
                ];

                $order->invoiceData = $invoiceData;
                $order->invoiceType = $input['invoice_type'] ?? '';
                $order->userId = $user->id;
                $order->payment = $input['payment'];
                $order->createdBy = $user->id;

                $cartData = $cartService->getData();

                return [
                    $checkoutService->createOrder($order, $cartData, $input),
                    $cartData,
                ];
            }
        );

        $checkoutService->notifyForCheckout($order, $cartData, $user);

        $cartStorage->clear();

        return $nav->to('melo_order_list')->full();
    }
}
