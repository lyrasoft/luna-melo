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
    protected int $lessonId = 0;

    #[Column('category_id')]
    protected int $categoryId = 0;

    #[Column('is_primary')]
    #[Cast('bool', 'int')]
    protected bool $isPrimary = false;

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        //
    }

    public function getLessonId(): int
    {
        return $this->lessonId;
    }

    public function setLessonId(int $lessonId): static
    {
        $this->lessonId = $lessonId;

        return $this;
    }

    public function getCategoryId(): int
    {
        return $this->categoryId;
    }

    public function setCategoryId(int $categoryId): static
    {
        $this->categoryId = $categoryId;

        return $this;
    }

    public function isPrimary(): bool
    {
        return $this->isPrimary;
    }

    public function setIsPrimary(bool $isPrimary): static
    {
        $this->isPrimary = $isPrimary;

        return $this;
    }
}
