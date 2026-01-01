<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace App\Seeder;

use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\Order;
use Lyrasoft\Melo\Entity\OrderItem;
use Lyrasoft\Melo\Enum\InvoiceType;
use Lyrasoft\Melo\Enum\OrderState;
use Lyrasoft\Melo\Enum\Payment;
use Lyrasoft\Melo\Service\OrderService;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Seed\Seeder;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\ORM\ORM;
use Windwalker\ORM\EntityMapper;

/**
 * Order Seeder
 *
 * @var Seeder          $seeder
 * @var ORM             $orm
 * @var DatabaseAdapter $db
 * @var ApplicationInterface $app
 */
$seeder->import(
    static function () use ($seeder, $orm, $db, $app) {
        $faker = $seeder->faker('zh_TW');

        /** @var EntityMapper<Order> $mapper */
        $mapper = $orm->mapper(Order::class);
        /** @var EntityMapper<OrderItem> $itemMapper */
        $itemMapper = $orm->mapper(OrderItem::class);
        $lessons = $orm->findList(Lesson::class)->all();
        $userIds = $orm->findColumn(User::class, 'id')->dump(true);

        $orderService = $app->service(OrderService::class);

        foreach (range(1, 150) as $i) {
            $item = $mapper->createEntity();

            $item->userId = (int) $faker->randomElement($userIds);
            $item->invoiceNo = 'T' . $faker->ean8();
            $item->state = $faker->randomElement(OrderState::values());
            $item->payment = $faker->randomElement(Payment::values());
            $item->note = $faker->paragraph();
            $item->invoiceType = $faker->randomElement(InvoiceType::values());

            if ($item->state === OrderState::CANCELLED) {
                $item->cancelledAt = $faker->dateTimeThisYear();
            }

            if ($item->state === OrderState::FAILED) {
                $item->expiredOn = $faker->dateTimeThisYear();
            }

            if ($item->state === OrderState::PAID) {
                $item->paidAt = $faker->dateTimeThisYear();
            }

            if ($item->payment === Payment::ATM) {
                $item->paymentData = [
                        'bank_code' => '001',
                        'bank_account' => '111111111111',
                    ];
            }

            $item->created = $faker->dateTimeThisYear();
            $item->modified = $item->created->modify('+5 days');
            $item->createdBy = $item->userId;

            $item = $mapper->createOne($item);

            $total = 0;

            /** @var Lesson $lesson */
            foreach ($faker->randomElements($lessons, 2) as $lesson) {
                $orderItem = $itemMapper->createEntity();

                $orderItem->orderId = $item->id;
                $orderItem->title = $lesson->title;
                $orderItem->lessonId = $lesson->id;
                $orderItem->image = $lesson->image;
                $orderItem->lessonData = $lesson->dump(true);
                $orderItem->price = $lesson->price;
                $orderItem->total = $lesson->price;

                $total += $lesson->price;

                $itemMapper->createOne($orderItem);

                $seeder->outCounting();
            }

            $item->total = $total;
            $item->no = $orderService->createOrderNo($item->id);

            $mapper->saveOne($item);
        }
    }
);

$seeder->clear(
    static function () use ($seeder, $orm, $db) {
        $seeder->truncate(Order::class);
        $seeder->truncate(OrderItem::class);
    }
);
