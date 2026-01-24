<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Order;

use Lyrasoft\Melo\Cart\Price\PriceObject;
use Lyrasoft\Melo\Cart\Price\PriceSet;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderHistory;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Entity\MeloOrderTotal;
use Lyrasoft\Melo\Module\Admin\Order\Form\EditForm;
use Lyrasoft\Melo\Repository\MeloOrderRepository;
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
    use OrderItemViewTrait;

    public function __construct(
        protected ORM $orm,
        protected FormFactory $formFactory,
        protected Navigator $nav,
        #[Autowire] protected MeloOrderRepository $repository
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

        /** @var MeloOrder $item */
        $item = $this->repository->getItem($id);

        // Bind item for injection
        $view[MeloOrder::class] = $item;

        $user = $this->orm->findOne(
            User::class,
            [
                'id' => $item?->userId
            ]
        )
            ?->dump(true);

        $form = $this->formFactory
            ->create(EditForm::class, address: $item->invoiceData->address)
            ->fillTo('item', $this->orm->extractEntity($item))
            ->fillTo('item', $this->repository->getState()->getAndForget('edit.data'));

        $orderItems = $this->getOrderItems($item->id);

        $histories = $this->getHistories($item->id);

        $totals = $this->getTotalPriceSet($item->id);

        return compact('form', 'id', 'item', 'orderItems', 'histories', 'totals');
    }

    #[ViewMetadata]
    protected function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle(
            $this->trans('unicorn.title.edit', title: '訂單')
        );
    }
}
