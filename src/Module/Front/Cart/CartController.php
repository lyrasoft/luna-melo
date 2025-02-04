<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Cart;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Cart\CartService;
use Lyrasoft\Melo\Cart\CartStorage;
use Lyrasoft\Melo\Entity\Order;
use Lyrasoft\Melo\Service\CheckoutService;
use Psr\Container\ContainerExceptionInterface;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Router\Navigator;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;

#[Controller]
class CartController
{
    public function ajax(AppContext $app): mixed
    {
        $task = $app->input('task');

        return $app->call([$this, $task]);
    }

    /**
     * @param  AppContext  $app
     *
     * @return  bool
     *
     * @throws ContainerExceptionInterface
     */
    public function deleteItem(
        AppContext $app
    ): bool {
        $hash = $app->input('hash');

        $cartStorage = $app->service(CartStorage::class);

        $cartStorage->deleteItem($hash);

        return true;
    }

    /**
     * @param  AppContext  $app
     *
     * @return  array
     * @throws ContainerExceptionInterface
     */
    public function addToCart(
        AppContext $app,
    ): array {
        $id = (int) $app->input('id');

        $cartStorage = $app->service(CartStorage::class);

        $cartStorage->addItem($id);

        return array_values($cartStorage->getItems());
    }

    /**
     * @param  AppContext  $app
     *
     * @return  array
     * @throws ContainerExceptionInterface
     */
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
            return $nav->to('cart');
        }

        /**
         * @var Order $order
         */
        [$order, $cartData] = $orm->getDb()->transaction(
            function () use ($input, $cartService, $user, $checkoutService) {
                $order = new Order();

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

                $order->setInvoiceData($invoiceData);
                $order->setInvoiceType($input['invoice_type'] ?? '');
                $order->setUserId($user->getId());
                $order->setPayment($input['payment']);
                $order->setCreatedBy($user->getId());

                $cartData = $cartService->getData();

                return [
                    $checkoutService->createOrder($order, $cartData, $input),
                    $cartData,
                ];
            }
        );

        $checkoutService->notifyForCheckout($order, $cartData, $user);

        $cartStorage->clear();

        return $nav->to('order_list')->full();
    }
}
