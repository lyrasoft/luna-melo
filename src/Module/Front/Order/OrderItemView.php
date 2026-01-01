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
use Lyrasoft\Melo\Repository\OrderRepository;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Html\HtmlFrame;
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
    public function __construct(
        protected ORM $orm,
        #[Autowire]
        protected OrderRepository $repository,
        #[Service]
        protected UserService $userService,
        #[Service]
        protected AccessService $accessService,
        #[Autowire]
        protected UserRepository $userRepository,
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

        $id = $app->input('id');

        $user = $this->userService->getUser();

        /** @var MeloOrder $item */
        $item = $this->repository->mustGetItem($id);

        if (
            !$this->accessService->userInRoles($user, ['admin', 'superuser'])
            && $item->userId !== $user->id
        ) {
            return new AccessDeniedException('無權限觀看這份訂單', 403);
        }

        $view[$item::class] = $item;

        $histories = $this->orm->findList(
            MeloOrderHistory::class,
            [
                'order_id' => $item->id,
            ]
        );

        $orderItems = $this->orm->findList(
            MeloOrderItem::class,
            [
                'order_id' => $item->id,
            ]
        );

        $userInfo = $this->userRepository->getListSelector()
            ->addFilter('user.id', $user->id)
            ->get();

        return compact(
            'item',
            'histories',
            'orderItems',
            'userInfo',
        );
    }

    #[ViewMetadata]
    public function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle('訂單');
    }
}
