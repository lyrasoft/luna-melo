<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Script;

use Unicorn\Script\UnicornScript;
use Windwalker\Core\Asset\AbstractScript;

/**
 * The MeloScript class.
 */
class MeloScript extends AbstractScript
{
    public function __construct(protected UnicornScript $unicornScript)
    {
    }

    public function lessonCart(): void
    {
        if ($this->available()) {
            $this->unicornScript->addRoute('@melo_cart_ajax');
            $this->unicornScript->addRoute('@melo_cart');

            $this->unicornScript->importMainThen('u.$melo.useLessonCartButtons();');
        }
    }
}
