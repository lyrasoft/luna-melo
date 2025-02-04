<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Order;

use Lyrasoft\Melo\Entity\Order;
use Lyrasoft\Melo\Entity\OrderItem;
use Lyrasoft\Melo\Module\Admin\Order\Form\EditForm;
use Lyrasoft\Melo\Repository\OrderRepository;
use Lyrasoft\Contact\Entity\Contact;
use Lyrasoft\Luna\Entity\User;
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

/**
 * The OrderEditView class.
 */
#[ViewModel(
    layout: 'order-edit',
    js: 'order-edit.js'
)]
class OrderEditView implements ViewModelInterface
{
    use TranslatorTrait;

    public function __construct(
        protected ORM $orm,
        protected FormFactory $formFactory,
        protected Navigator $nav,
        #[Autowire] protected OrderRepository $repository
    ) {
    }

    /**
     * Prepare
     *
     * @param  AppContext  $app
     * @param  View        $view
     *
     * @return  mixed
     */
    public function prepare(AppContext $app, View $view): mixed
    {
        $id = $app->input('id');

        /** @var Order $item */
        $item = $this->repository->getItem($id);

        // Bind item for injection
        $view[Order::class] = $item;

        $user = $this->orm->findOne(
            User::class,
            [
                'id' => $item?->getUserId()
            ]
        )
            ?->dump(true);

        $remit = $this->orm->findOne(
            Contact::class,
            [
                'type' => 'remittance',
                [
                    'details ->> order_no', '=', $item->getNo()
                ]
            ]
        );

        $form = $this->formFactory
            ->create(EditForm::class)
            ->fill(
                [
                    'item' => $this->repository->getState()->getAndForget('edit.data')
                        ?: $this->orm->extractEntity($item)
                ]
            )
            ->fill(
                [
                    'user' => array_merge($user, ['phone' => $user['params']['phone'] ?? '']),
                    'remit' => [
                        'time' => $remit?->getDetails()['time'] ?? null,
                        'account' => $remit?->getDetails()['account'],
                        'note' => $remit?->getContent()
                    ]
                ]
            );

        $orderItems = $this->orm->findList(
            OrderItem::class,
            [
                'order_id' => $item?->getId(),
            ]
        );

        return compact('form', 'id', 'item', 'orderItems');
    }

    #[ViewMetadata]
    protected function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle(
            $this->trans('unicorn.title.edit', title: '訂單')
        );
    }
}
