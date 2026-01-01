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
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Entity\UserLessonMap;
use Lyrasoft\Melo\Entity\UserSegmentMap;
use Lyrasoft\Melo\Enum\SegmentType;
use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Lyrasoft\Luna\Entity\User;
use Windwalker\Core\Seed\Seeder;
use Windwalker\Database\DatabaseAdapter;
use Windwalker\ORM\EntityMapper;
use Windwalker\ORM\ORM;
use Windwalker\Utilities\Utf8String;

/**
 * Segment Seeder
 *
 * @var Seeder $seeder
 * @var ORM $orm
 * @var DatabaseAdapter $db
 */
$seeder->import(
    static function () use ($seeder, $orm, $db) {
        $faker = $seeder->faker('zh_TW');
        /** @var EntityMapper<Segment> $mapper */
        $mapper = $orm->mapper(Segment::class);
        $mapMapper = $orm->mapper(UserSegmentMap::class);
        $lessonIds = $orm->findColumn(Lesson::class, 'id')->dump(true);
        $userIds = $orm->findColumn(User::class, 'id')->dump(true);

        foreach ($lessonIds as $lessonId) {
            $lessonStudentIds = $orm->findColumn(
                UserLessonMap::class,
                'user_id',
                [
                    'lesson_id' => $lessonId,
                ]
            )
                ->dump(true);

            foreach (range(1, random_int(3, 4)) as $i) {
                // Chapter
                $chapter = $mapper->createEntity();

                $chapter->lessonId = (int) $lessonId;
                $chapter->type = SegmentType::DEFAULT;
                $chapter->parentId = 0;
                $chapter->title = Utf8String::ucwords(
                        $faker->sentence(3)
                    );
                $chapter->state = $faker->optional(0.7, 0)->passthrough(1);
                $chapter->ordering = $i;
                $chapter->created = $faker->dateTimeThisYear();
                $chapter->modified = $chapter->created?->modify('+10days');
                $chapter->createdBy = (int) $faker->randomElement($userIds);

                $chapter = $mapper->createOne($chapter);

                $k = 1;

                foreach (SegmentType::values() as $type) {
                    if ($type === SegmentType::DEFAULT) {
                        continue;
                    }

                    // segment
                    ++$k;

                    $segment = $mapper->createEntity();

                    $segment->lessonId = (int) $lessonId;
                    $segment->type = $type;
                    $segment->parentId = $chapter->id;
                    $segment->title = Utf8String::ucwords(
                            $faker->sentence(3)
                        );
                    $segment->state = $faker->optional(0.7, 0)->passthrough(1);
                    $segment->preview = $faker->optional(0.7, false)->passthrough(true);
                    $segment->ordering = $k;
                    $segment->created = $faker->dateTimeThisYear();
                    $segment->modified = $segment->created?->modify('+10days');
                    $segment->createdBy = (int) $faker->randomElement($userIds);

                    if ($type === SegmentType::VIDEO) {
                        $segment->src = 'https://lyratest.s3.amazonaws.com/emooc/sintel-short.mp4';
                        $segment->captionSrc = 'https://lyratest.s3.amazonaws.com/emooc/sintel-subtitles-en.vtt';
                        $segment->filename = 'sintel-short.mp4';
                        $segment->ext = 'mp4';
                        $segment->duration = random_int(40, 240);
                    }

                    if ($type === SegmentType::HOMEWORK) {
                        $segment->content = $faker->paragraph(5);
                    }

                    if ($type === SegmentType::QUIZ) {
                        $segment->canSkip = $faker->optional(0.8, true)->passthrough(false);
                    }

                    $segment = $mapper->createOne($segment);

                    foreach ($lessonStudentIds as $studentId) {
                        /** @var UserSegmentMap $map */
                        $map = $mapMapper->createEntity();

                        $map->userId = (int) $studentId;
                        $map->lessonId = (int) $lessonId;
                        $map->segmentId = $segment->id;
                        $map->segmentType = $segment->type;
                        $map->description = $faker->paragraph();
                        $map->created = $faker->dateTimeThisYear();

                        if ($map->segmentType === SegmentType::QUIZ) {
                            $map->score = random_int(60, 100);
                            $map->status = $faker->randomElement(
                                    [
                                        UserSegmentStatus::PROCESS,
                                        UserSegmentStatus::PASSED,
                                        UserSegmentStatus::FAILED,
                                    ]
                                );
                        }

                        if ($map->segmentType === SegmentType::HOMEWORK) {
                            $map->assignment = $faker->unsplashImage();
                            $map->status = $faker->randomElement(
                                    [
                                        UserSegmentStatus::PENDING,
                                        UserSegmentStatus::DONE,
                                    ]
                                );
                            $map->assignmentUploadTime = $map->created?->modify('+3 days');
                        }

                        $mapMapper->createOne($map);

                        $seeder->outCounting();
                    }
                }
            }
        }
    }
);

$seeder->clear(
    static function () use ($seeder, $orm, $db) {
        $seeder->truncate(Segment::class);
        $seeder->truncate(UserSegmentMap::class);
    }
);
