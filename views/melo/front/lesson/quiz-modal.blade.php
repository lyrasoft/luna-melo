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
use Windwalker\Core\Router\SystemUri;

?>

<div class="modal fade c-quiz-modal" id="quiz-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">
                    測驗
                </h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body px-5 mx-5">
                <form id="quiz-form" enctype="multipart/form-data" method="post">
                    <div class="my-4 text-muted text-center j-quiz-title">
                    </div>

                    <div class="text-danger mb-5 text-center">
                        ＊提醒您未完成此測驗無法前往下個章節唷！
                    </div>

                    <div class="c-question-list mb-4"></div>

                    <div class="text-danger text-center mb-5">
                        ＊提交後無法變更答案唷！
                    </div>

                    <input type="hidden" class="j-quiz-section-id" name="item[segment_id]">

                    <x-csrf></x-csrf>

                    <div class="text-center mb-5">
                        <button type="button" class="btn btn-primary btn-lg j-quiz-submit">
                            提交
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
