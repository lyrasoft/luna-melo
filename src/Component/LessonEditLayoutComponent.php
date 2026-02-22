<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Component;

use Closure;
use Lyrasoft\Melo\Entity\Lesson;
use Windwalker\Core\Edge\Attribute\EdgeComponent;
use Windwalker\Edge\Component\AbstractComponent;
use Windwalker\Utilities\Attributes\Prop;

class LessonEditLayoutComponent extends AbstractComponent
{
    #[Prop]
    public ?Lesson $lesson = null;

    #[Prop]
    public bool $card = false;

    public function render(): Closure|string
    {
        return 'components.lesson-edit-layout';
    }
}
