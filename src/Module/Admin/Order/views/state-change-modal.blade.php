<?php

declare(strict_types=1);

namespace App\View;

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

use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Enum\OrderState;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $item MeloOrder
 */

$route ??= 'melo_order_list';
$id ??= 'state-change-modal';

?>

<div class="modal fade" id="{{ $id }}" tabindex="-1" role="dialog"
    aria-labelledby="order-state-modal-label"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="order-state-modal-label">
                    變更狀態
                </h4>
                <button type="button" class="close btn-close" data-bs-dismiss="modal" data-dismiss="modal"
                    aria-label="Close">
                    <span aria-hidden="true" class="visually-hidden">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="state-form" method="post" action="{{ $nav->to($route) }}">
                    <div class="form-group mb-4">
                        <label for="input-order-state" class="form-label">
                            狀態
                        </label>
                        <select id="input-order-state" name="state" class="form-select">
                            <option value="">
                                不改變
                            </option>
                            @foreach (OrderState::cases() as $state)
                                <option value="{{ $state->value }}">
                                    {{ $state->getTitle($lang) }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div class="form-group mb-4 form-check">
                        <input id="input-order-notify" type="checkbox" value="1" name="notify"
                            class="form-check-input" />
                        <label for="input-order-notify" class="form-label">
                            通知用戶
                        </label>
                    </div>

                    <div class="form-group mb-4">
                        <label for="inout-order-message" class="form-label">
                            備註
                        </label>
                        <textarea name="message" id="inout-order-message" class="form-control" rows="7"></textarea>
                    </div>

                    <div>
                        <button type="submit" class="btn btn-primary w-100" data-dos>
                            發送
                        </button>
                    </div>

                    <div class="d-none">
                        <input name="_method" type="hidden" value="PATCH" />
                        <input name="task" type="hidden" value="transition" />
                        <input name="id" type="hidden" value="{{ $item->id }}" />
                        <x-csrf></x-csrf>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
