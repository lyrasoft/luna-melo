<?php

/**
 * Part of starter project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace App\Seeder;

use Lyrasoft\Melo\Entity\MeloOption;
use Lyrasoft\Melo\Entity\Question;
use Lyrasoft\Melo\Enum\QuestionType;
use Windwalker\Core\Seed\Seeder;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\ORM\ORM;
use Windwalker\ORM\EntityMapper;
use Windwalker\Utilities\Utf8String;

/**
 * Option Seeder
 *
 * @var Seeder          $seeder
 * @var ORM             $orm
 * @var DatabaseAdapter $db
 */
$seeder->import(
    static function () use ($seeder, $orm, $db) {
        $faker = $seeder->faker('zh_TW');

        /** @var EntityMapper<MeloOption> $mapper */
        $mapper = $orm->mapper(MeloOption::class);
        $questions = $orm->findList(Question::class);

        /** @var Question $question */
        foreach ($questions as $question) {
            if ($question->type === QuestionType::BOOLEAN) {
                return;
            }

            $total = random_int(2, 4);

            $answers = array_fill(0, $total, false);

            if ($question->isMultiple) {
                $trueCount = random_int(2, $total);

                foreach (range(0, $trueCount) as $i) {
                    $answers[$i] = true;
                }
            } else {
                $answers[0] = true;
            }

            shuffle($answers);

            foreach (range(1, $total) as $j) {
                $item = $mapper->createEntity();

                $item->title = Utf8String::ucwords(
                        $faker->sentence(3)
                    );
                $item->questionId = $question->id;
                $item->state = 1;
                $item->ordering = $j;
                $item->isAnswer = $answers[$j - 1];

                $mapper->createOne($item);

                $seeder->outCounting();
            }
        }
    }
);

$seeder->clear(
    static function () use ($seeder, $orm, $db) {
        $seeder->truncate(MeloOption::class);
    }
);
