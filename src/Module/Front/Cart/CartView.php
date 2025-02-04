<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Cart;

use Lyrasoft\Melo\Cart\CartStorage;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Module\Front\Cart\Form\InvoiceForm;
use Psr\Cache\InvalidArgumentException;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

#[ViewModel(
    layout: 'cart',
    js: 'cart.js'
)]
class CartView implements ViewModelInterface
{
    public function __construct(
        protected ORM $orm,
        protected UserService $userService,
        protected Navigator $nav,
        #[Autowire]
        protected CartStorage $cartStorage,
        protected FormFactory $formFactory,
    ) {
        //
    }

    /**
     * Prepare View.
     *
     * @param  AppContext  $app   The web app context.
     * @param  View        $view  The view object.
     *
     * @return  mixed
     * @throws InvalidArgumentException
     */
    public function prepare(AppContext $app, View $view): mixed
    {
        $user = $this->userService->getUser();

        if (!$user->isLogin()) {
            return $this->nav->to('login')->withReturn();
        }

        if ($this->cartStorage->count() === 0) {
            return $this->nav->to('home');
        }

        $form = $this->formFactory
            ->create(InvoiceForm::class)
            ->setNamespace('checkout');

        $cartItems = $app->state->get('cart.items') ?? [];

        return compact('cartItems', 'form');
    }

    #[ViewMetadata]
    public function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle('購物車');
    }
}
