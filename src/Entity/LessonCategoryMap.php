<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Entity;

use Windwalker\ORM\Attributes\AutoIncrement;
use Windwalker\ORM\Attributes\Cast;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\EntityInterface;
use Windwalker\ORM\EntityTrait;
use Windwalker\ORM\Metadata\EntityMetadata;

#[Table('lesson_category_maps', 'lesson_category_map')]
#[\AllowDynamicProperties]
class LessonCategoryMap implements EntityInterface
{
    use EntityTrait;

    #[Column('lesson_id')]
    public int $lessonId = 0;

    #[Column('category_id')]
    public int $categoryId = 0;

    #[Column('is_primary')]
    #[Cast('bool', 'int')]
    public bool $isPrimary = false;

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        //
    }
}
