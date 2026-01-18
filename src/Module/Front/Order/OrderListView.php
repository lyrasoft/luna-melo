<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\Order;

use Lyrasoft\Luna\Repository\UserRepository;
use Lyrasoft\Luna\User\Exception\AccessDeniedException;
use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Repository\MeloOrderRepository;
use Unicorn\View\ORMAwareViewModelTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\DI\Attributes\Service;

#[ViewModel(
    layout: 'order-list',
    js: 'order-list.js'
)]
class OrderListView implements ViewModelInterface
{
    use ORMAwareViewModelTrait;

    public function __construct(
        protected Navigator $nav,
        #[Autowire]
        protected MeloOrderRepository $repository,
        #[Service]
        protected UserService $userService,
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
    public function prepare(AppContext $app, View $view): mixed
    {
        if (!$this->userService->isLogin()) {
            return $this->nav->to('login')->withReturn();
        }

        $page = $app->input('page');
        $limit = $app->input('limit') ?? 30;
        $ordering = $this->getDefaultOrdering();

        $userId = $this->userService->getUser()->id;

        $userInfo = $this->userRepository->getListSelector()
            ->addFilter('user.id', $userId)
            ->get();

        $items = $this->repository->getListSelector()
            ->addFilters([])
            ->where('user_id', $userId)
            ->ordering($ordering)
            ->page($page)
            ->limit($limit)
            ->setDefaultItemClass(MeloOrder::class);

        $pagination = $items->getPagination();

        return compact('items', 'pagination', 'userInfo');
    }

    /**
     * Get default ordering.
     *
     * @return  string
     */
    public function getDefaultOrdering(): string
    {
        return 'order.id DESC';
    }

    #[ViewMetadata]
    protected function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle('Order List');
    }
}
