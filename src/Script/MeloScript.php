<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Script;

use Windwalker\Core\Asset\AbstractScript;

/**
 * The MeloScript class.
 */
class MeloScript extends AbstractScript
{
    public function vueUtilities(): void
    {
        if ($this->available()) {
            $this->js('@melo/melo-vue-utilities.js');
            $this->js('@melo/melo-stack.js');
        }
    }

    public function sweetAlert(): void
    {
        if ($this->available()) {
            $this->js('@sweetalert');
        }
    }
}
