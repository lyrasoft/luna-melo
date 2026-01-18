<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Order;

use Lyrasoft\Luna\Access\AccessService;
use Lyrasoft\Luna\Repository\UserRepository;
use Lyrasoft\Luna\User\Exception\AccessDeniedException;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderHistory;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Entity\MeloOrderTotal;
use Lyrasoft\Melo\Features\Payment\PaymentComposer;
use Lyrasoft\Melo\Repository\MeloOrderRepository;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;

#[ViewModel(
    layout: 'order-item',
    js: 'order-item.js'
)]
class OrderItemView implements ViewModelInterface
{
    use TranslatorTrait;

    public function __construct(
        protected ORM $orm,
        #[Autowire]
        protected MeloOrderRepository $repository,
        #[Autowire]
        protected UserRepository $userRepository,
        protected UserService $userService,
        protected AccessService $accessService,
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
     */
    public function prepare(AppContext $app, View $view): array
    {
        if (!$this->userService->isLogin()) {
            throw new AccessDeniedException('請先登入', 403);
        }

        $no = $app->input('no');

        $user = $this->userService->getUser();

        /** @var MeloOrder $item */
        $item = $this->repository->mustGetItem(compact('no'));

        if (
            $item->userId !== $user->id
            && !$this->accessService->userInRoles($user, ['admin', 'superuser'])
        ) {
            return new AccessDeniedException('無權限觀看這份訂單', 403);
        }

        $view[$item::class] = $item;

        $histories = $this->orm->from(MeloOrderHistory::class)
            ->where('order_id', $item->id)
            ->order('id', 'DESC')
            ->all(MeloOrderHistory::class);

        $totals = $this->orm->from(MeloOrderTotal::class)
            ->where('order_id', $item->id)
            ->order('ordering', 'ASC')
            ->all(MeloOrderTotal::class);

        $orderItems = $this->orm->findList(
            MeloOrderItem::class,
            [
                'order_id' => $item->id,
            ]
        );

        $payment = $this->paymentComposer->getGateway($item->payment);
        $paymentTitle = $item->paymentData->paymentTitle ?: $payment?->getTitle($this->lang);

        $userInfo = $this->userRepository->getListSelector()
            ->addFilter('user.id', $user->id)
            ->get();

        return compact(
            'item',
            'histories',
            'orderItems',
            'userInfo',
            'payment',
            'paymentTitle',
            'totals',
        );
    }

    #[ViewMetadata]
    public function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle('訂單');
    }
}
