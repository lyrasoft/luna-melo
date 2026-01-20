<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Field;

use App\Entity\Lesson;
use Unicorn\Field\ModalField;

class LessonModalField extends ModalField
{
    protected function configure(): void
    {
        $this->table(Lesson::class);
        $this->route('lesson_list');
    }
}
