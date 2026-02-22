<?php

declare(strict_types=1);

namespace App\view;

/**
 * Global variables
 * --------------------------------------------------------------
 * @var $app       AppContext      Application context.
 * @var $vm        object          The view model object.
 * @var $uri       SystemUri       System Uri information.
 * @var $chronos   ChronosService  The chronos datetime service.
 * @var $nav       Navigator       Navigator object to build route.
 * @var $asset     AssetService    The Asset manage service.
 * @var $lang      LangService     The language translation service.
 */

use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;use Windwalker\Form\Form;

/**
 * @var $form Form
 */
?>
<div class="modal fade" id="lesson-assign-modal" tabindex="-1" role="dialog" aria-labelledby="lesson-assign-modal-label"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="lesson-assign-modal-label">
                    指派課程
                </h4>
                <button type="button" class="close btn-close" data-bs-dismiss="modal" data-dismiss="modal"
                    aria-label="Close">
                    <span aria-hidden="true" class="visually-hidden">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <x-field :field="$form['assign/userId']" />
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <div>
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" data-bs-dismiss="modal">
                        <i class="fa fa-xmark"></i>
                        關閉
                    </button>
                </div>
                <div>
                    <button type="button" class="btn btn-primary" style="width: 150px"
                        data-dos
                        @click="grid.batch('assignLessons')">
                        <i class="fa fa-paper-plane"></i>
                        指派
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
