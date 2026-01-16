<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\LessonCart;

use Lyrasoft\Melo\Cart\CartStorage;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Features\Payment\MeloPaymentInterface;
use Lyrasoft\Melo\Features\Payment\PaymentComposer;
use Lyrasoft\Melo\Module\Front\LessonCart\Form\InvoiceForm;
use Psr\Cache\InvalidArgumentException;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

#[ViewModel(
    layout: 'lesson-cart',
    js: 'lesson-cart.js'
)]
class LessonCartView implements ViewModelInterface
{
    use TranslatorTrait;

    public function __construct(
        protected ORM $orm,
        protected UserService $userService,
        protected Navigator $nav,
        #[Autowire]
        protected CartStorage $cartStorage,
        protected FormFactory $formFactory,
        protected PaymentComposer $paymentComposer,
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

        $payments = $this->paymentComposer->getGateways();
        $payments = $payments->map(fn (MeloPaymentInterface $payment) => $payment->toArray($this->lang));

        return compact('cartItems', 'form', 'payments');
    }

    #[ViewMetadata]
    public function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle('購物車');
    }
}
