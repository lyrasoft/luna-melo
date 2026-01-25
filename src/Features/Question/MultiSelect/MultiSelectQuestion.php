<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Question\MultiSelect;

use Lyrasoft\Melo\Data\QnOption;
use Lyrasoft\Melo\Data\Question\SelectQnParams;
use Lyrasoft\Melo\Features\Question\AbstractQuestion;
use Windwalker\Utilities\Contract\LanguageInterface;

class MultiSelectQuestion extends AbstractQuestion
{
    public static function id(): string
    {
        return 'multiple';
    }

    public static function icon(): string
    {
        return 'fas fa-list-ul';
    }

    public static function title(LanguageInterface $lang): string
    {
        return '多選題';
    }

    public static function description(LanguageInterface $lang): string
    {
        return '提供多個選項供使用者選擇。';
    }

    public function isAnswerCorrect(mixed $value): bool
    {
        $value = (array) $value;
        $results = [];

        $options = $this->getOptions();

        foreach ($options as $option) {
            if ($option->isAnswer) {
                $results[] = in_array($option->text, $value, true);
            } else {
                $results[] = !in_array($option->text, $value, true);
            }
        }

        return !in_array(false, $results, true);
    }

    public function getParams(): SelectQnParams
    {
        return SelectQnParams::wrap($this->data->params);
    }

    /**
     * @return  array<QnOption>
     */
    public function getOptions(): array
    {
        return $this->getParams()->options;
    }
}
