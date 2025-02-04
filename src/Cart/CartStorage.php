<?php

/**
 * Part of shopgo project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    MIT
 */

declare(strict_types=1);

namespace Lyrasoft\Melo\Cart;

use Windwalker\Core\State\AppState;

/**
 * The CartStorage class.
 *
 * @psalm-type CartStorageItem = array{ lessonId: int, attachments: ?array<int, int>, quantity: int, options: array }
 */
class CartStorage
{
    protected const CART_ITEMS_KEY = 'cart.items';

    public function __construct(
        protected AppState $state
    ) {
    }

    /**
     * hash
     *
     * @param int $id
     *
     * @return  string
     */
    public static function hash(int $id): string
    {
        return md5((string) $id);
    }

    /**
     * exists
     *
     * @param string $hash
     *
     * @return  bool
     */
    public function exists(string $hash): bool
    {
        return $this->getItemByHash($hash) !== null;
    }

    /**
     * count
     *
     * @return  int
     */
    public function count(): int
    {
        return \count($this->getItems());
    }

    /**
     * @param  int  $id
     *
     * @return  void
     */
    public function addItem(int $id): void
    {
        $hash = self::hash($id);

        if ($this->exists($hash)) {
            return;
        }

        $items = $this->getItems();

        $items[$hash] = $id;

        $this->setItems($items);
    }

    /**
     * @param  int  $id
     *
     * @return  array|null
     */
    public function getItem(int $id): ?int
    {
        return $this->getItemByHash(self::hash($id));
    }

    /**
     * @param  string  $hash
     *
     * @return  array|null
     */
    public function getItemByHash(string $hash): ?int
    {
        return $this->getItems()[$hash] ?? null;
    }

    /**
     * getItems
     *
     * @return  array
     */
    public function getItems(): array
    {
        return (array) $this->state->get(self::CART_ITEMS_KEY);
    }

    /**
     * @param  array  $items
     *
     * @return  void
     */
    public function setItems(array $items): void
    {
        $this->state->remember(self::CART_ITEMS_KEY, $items);
    }

    /**
     * @param  string  $hash
     *
     * @return  void
     */
    public function deleteItem(string $hash): void
    {
        $items = $this->getItems();

        if (isset($items[$hash])) {
            unset($items[$hash]);
        }

        $this->setItems($items);
    }

    /**
     * @return  void
     */
    public function clear(): void
    {
        $this->state->remember(static::CART_ITEMS_KEY, []);
    }
}
