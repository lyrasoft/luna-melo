<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Field;

use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Features\Segment\SegmentFinder;
use Windwalker\DI\Attributes\Inject;
use Windwalker\DOM\HTMLElement;
use Windwalker\Form\Field\ListField;

use function Windwalker\unwrap_enum;

class SectionListField extends ListField
{
    #[Inject]
    protected SegmentFinder $segmentFinder;

    public int $lessonId = 0;

    public string|\BackedEnum|null $sectionType = null;

    /**
     * @param  HTMLElement  $input
     *
     * @return  HTMLElement
     */
    public function prepareInput(HTMLElement $input): HTMLElement
    {
        return parent::prepareInput($input);
    }

    public function lessonId(int $lessonId): static
    {
        $this->lessonId = $lessonId;

        return $this;
    }

    public function sectionType(\BackedEnum|string|null $sectionType): static
    {
        $this->sectionType = $sectionType;

        return $this;
    }

    public function getLessonId(): int
    {
        return $this->lessonId;
    }

    public function getSectionType(): \BackedEnum|string|null
    {
        return $this->sectionType;
    }

    protected function prepareOptions(): array
    {
        if (!$this->lessonId) {
            throw new \RuntimeException('Lesson ID is required to get sections.');
        }

        $chapters = $this->segmentFinder->getChaptersSections($this->lessonId);

        $optionGroups = [];

        /** @var Segment $chapter */
        foreach ($chapters as $j => $chapter) {
            $options = [];
            $c = $j + 1;

            foreach ($chapter->children as $s => $section) {
                if ($this->sectionType && unwrap_enum($section->type) !== unwrap_enum($this->sectionType)) {
                    continue;
                }

                $serial = $c . '.' . ($s + 1);

                $options[] = static::createOption($serial . ' ' . $section->title, $section->id);
            }

            if ($options) {
                $optionGroups[$c . ' ' . $chapter->title] = $options;
            }
        }

        return $optionGroups;
    }

    /**
     * @return  array
     */
    protected function getAccessors(): array
    {
        return array_merge(
            parent::getAccessors(),
            []
        );
    }
}
