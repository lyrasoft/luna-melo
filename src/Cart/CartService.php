<?php

/**
 * Part of shopgo project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Lyrasoft\Melo\Cart;

use Lyrasoft\Melo\Cart\Price\PriceObject;
use Lyrasoft\Melo\Cart\Price\PriceSet;
use Brick\Math\Exception\MathException;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Repository\LessonRepository;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\Router\Navigator;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\ORM\ORM;

use function Windwalker\where;

/**
 * The CartService class.
 */
class CartService
{
    use TranslatorTrait;

    public function __construct(
        protected ApplicationInterface $app,
        protected Navigator $nav,
        protected ORM $orm,
        #[Autowire]
        protected CartStorage $cartStorage,
        #[Autowire]
        protected LessonRepository $repository,
    ) {
        //
    }

    /**
     * getData
     *
     * @return  array
     *
     * @throws \Exception
     */
    public function getData(): array
    {
        $lessons = $this->getItems();

        $productTotal = new PriceObject('lesson_total', 0, '小計');
        $grandTotal   = new PriceObject('grand_total', 0, '總計');

        $totalPrices = new PriceSet();
        $totalPrices->set($productTotal);
        $totalPrices->set($grandTotal);
        
        foreach ($lessons as $lesson) {
            $totalPrices->plus('lesson_total', $lesson['totals']->get('total'));
            $totalPrices->plus('grand_total', $lesson['totals']->get('final_total'));
        }

        if ($totalPrices->get('grand_total')->lt('0')) {
            $totalPrices->get('grand_total')->setPrice(0);
        }

        return [
            'items' => $lessons,
            'totals' => $totalPrices,
        ];
    }

    /**
     * @throws MathException
     */
    public function getItems()
    {
        $cartStorage = $this->app->service(CartStorage::class);

        $ids = $cartStorage->getItems();

        $items = $this->repository->getListSelector()
            ->where('lesson.id', $ids ?: [0])
            ->where('lesson.state', 1)
            ->limit(0)
            ->all(Lesson::class);

        $lessons = [];

        foreach ($items as $item) {
            $item = $this->prepareCartItem($item);
            $item['hash'] = array_flip($ids)[$item['id']];

            $lessons[] = $item;
        }

        return $lessons;
    }

    /**
     * @throws MathException
     */
    public function prepareCartItem(Lesson $lesson): ?array
    {
        return $this->preparePrices($lesson);
    }

    /**
     * @throws MathException
     */
    public function preparePrices(Lesson $lesson): ?array
    {
        $prices = new PriceSet();

        $originPrice  = $lesson->getPrice();
        $specialPrice = $lesson->getSpecialPrice();

        $prices->set(new PriceObject('origin', $originPrice));

        if ($lesson->isFree()) {
            $prices->set(new PriceObject('final', '0'));
        } elseif ($lesson->isSpecial()) {
            $prices->set(new PriceObject('final', $specialPrice));
        } else {
            $prices->set(new PriceObject('final', $originPrice));
        }

        $item = $lesson->dump(true);

        $item['prices'] = $prices;
        $item['totals'] = new PriceSet();

        $item['totals']->set(new PriceObject('total', $prices->get('final')->getPrice()));
        $item['totals']->set(new PriceObject('final_total', $prices->get('final')->getPrice()));

        return $item;
    }
}
