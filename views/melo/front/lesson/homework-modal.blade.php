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

use Unicorn\Field\FileDragField;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

$formFactory = $app->service(FormFactory::class);

$homeworkUploadField = $formFactory->createField(FileDragField::class)
    ->setName('homework_file')
    ->accept('pdf, jpg, png, doc, docx');

?>

<div class="modal fade c-homework-modal" id="homework-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">
                    作業上傳
                </h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="homework-form" enctype="multipart/form-data" method="post">
                    <h6>
                        作業標題
                    </h6>

                    <div class="mb-4 text-muted j-homework-title">
                    </div>

                    <h6>
                        章節
                    </h6>

                    <div class="mb-4 text-muted j-homework-index"></div>

                    <h6>
                        敘述
                    </h6>

                    <div class="mb-4 text-muted j-homework-content"></div>

                    <h6>
                        作業敘述
                    </h6>

                    <div class="mb-2">
                        <textarea class="form-control" name="item[description]" placeholder="寫下作業敘述..."
                            rows="5"></textarea>
                    </div>

                    <div class="mb-4">
                        {!! $homeworkUploadField->renderInput() !!}
                    </div>

                    <div class="mb-4 pb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="item[front_show]" id="front-show-true"
                                value="true" checked>
                            <label class="form-check-label" for="front-show-true">
                                公開在前台
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="item[front_show]" id="front-show-false"
                                value="false">
                            <label class="form-check-label" for="front-show-false">
                                不公開在前台
                            </label>
                        </div>
                    </div>

                    <input type="hidden" class="j-homework-section-id" name="item[segment_id]">

                    <x-csrf></x-csrf>

                    <div class="d-grid gap-2 mx-4 mb-5">
                        <button type="submit" class="btn btn-primary j-homework-submit">
                            確認送出
                        </button>
                        <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">
                            先跳過此節
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
