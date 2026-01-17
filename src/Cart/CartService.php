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
use Lyrasoft\Melo\Data\CartData;
use Lyrasoft\Melo\Data\CartItem;
use Lyrasoft\Melo\Entity\Lesson;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\Router\Navigator;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;

use function Windwalker\uid;
use function Windwalker\where;

#[Service]
class CartService
{
    use TranslatorTrait;

    public function __construct(
        protected ApplicationInterface $app,
        protected Navigator $nav,
        protected ORM $orm,
        #[Autowire]
        protected CartStorage $cartStorage,
    ) {
        //
    }

    public function getData(): CartData
    {
        $cartItems = $this->getItems();

        return $this->itemsToCartData($cartItems);
    }

    /**
     * @param  array<CartItem>  $cartItems
     *
     * @return  CartData
     */
    public function itemsToCartData(array $cartItems): CartData
    {
        $productTotal = new PriceObject('lesson_total', 0, '小計');
        $grandTotal = new PriceObject('grand_total', 0, '總計');

        $totalPrices = new PriceSet();
        $totalPrices->set($productTotal);
        $totalPrices->set($grandTotal);

        foreach ($cartItems as $cartItem) {
            $totalPrices->plus('lesson_total', $cartItem->totals->get('total'));
            $totalPrices->plus('grand_total', $cartItem->totals->get('final_total'));
        }

        if ($totalPrices->get('grand_total')->lt('0')) {
            $totalPrices->get('grand_total')->setPrice(0);
        }

        return new CartData(
            items: $cartItems,
            totals: $totalPrices
        );
    }

    /**
     * @return  array<CartItem>
     */
    public function getItems(): array
    {
        $cartStorage = $this->app->service(CartStorage::class);

        $ids = $cartStorage->getItems();

        $items = $this->orm->from(Lesson::class)
            ->where('lesson.id', $ids ?: [0])
            ->where('lesson.state', 1)
            ->all(Lesson::class);

        $cartItems = [];

        foreach ($items as $item) {
            $item = $this->lessonToCartItem($item);

            $cartItems[] = $item;
        }

        return $cartItems;
    }

    /**
     * @throws MathException
     */
    public function lessonToCartItem(Lesson $lesson): CartItem
    {
        [$prices, $totals] = $this->preparePrices($lesson);

        return new CartItem(
            uid: uid(),
            hash: sha1((string) $lesson->id),
            lesson: $lesson,
            prices: $prices,
            totals: $totals,
        );
    }

    /**
     * @param  Lesson  $lesson
     *
     * @return  array{ PriceSet, PriceSet }
     */
    public function preparePrices(Lesson $lesson): array
    {
        $prices = new PriceSet();

        $originPrice  = $lesson->price;
        $specialPrice = $lesson->specialPrice;

        $prices->set(new PriceObject('origin', $originPrice));

        if ($lesson->isFree) {
            $prices->set(new PriceObject('final', '0'));
        } elseif ($lesson->isSpecial) {
            $prices->set(new PriceObject('final', $specialPrice));
        } else {
            $prices->set(new PriceObject('final', $originPrice));
        }

        $totals = new PriceSet();

        $totals->set(new PriceObject('total', $prices->get('final')->getPrice()));
        $totals->set(new PriceObject('final_total', $prices->get('final')->getPrice()));

        return [$prices, $totals];
    }
}
