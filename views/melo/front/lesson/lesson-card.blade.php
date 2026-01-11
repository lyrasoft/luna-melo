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

use Lyrasoft\Favorite\Entity\Favorite;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Features\LessonService;
use Unicorn\Script\UnicornScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var Lesson $item
 */

$uniScript = $app->service(UnicornScript::class);
$uniScript->addRoute('@cart_ajax');
$uniScript->addRoute('cart');
$asset->js('vendor/lyrasoft/melo/dist/lesson.ts');

$lessonService = $app->service(LessonService::class);
$ownedLesson = $lessonService->checkUserHasLesson($item->id);
?>

<div class="card h-100 border-0 shadow">
    <div class="card-img-top ratio ratio-4x3">
        <img src="{{ $item->image }}"
            class="img-fluid object-fit-cover rounded-top"
            alt="{{ $item->title }}">
    </div>

    <div class="card-body d-flex flex-column">
        <a href="{{ $nav->to('lesson_item', ['id' => $item->id]) }}" class="stretched-link">
            <h4>
                {{ $item->title }}
            </h4>
        </a>
        <div class="">
            <span>分類：</span>
            <span>
                {{ $item->category->title ?? '' }}
            </span>
        </div>

        <div class="mb-3">
            <span>講師：</span>
            <span>
                 {{ $item->teacher->name ?? '' }}
            </span>
        </div>

        <div class="mt-auto d-flex justify-content-between align-items-end">
            <div>
                @if(!$item->isFree)
                    @if($item->isSpecial)
                        <div class="text-decoration-line-through">
                            <span>售價</span>
                            <span>
                                {{ $item->price }}
                            </span>
                        </div>

                        <h4 class="text-primary">
                            <span>特價</span>
                            <span>
                                {{ $item->specialPrice }}
                            </span>
                        </h4>
                    @else
                        <h4 class="text-primary">
                            <span>售價</span>
                            <span>
                                {{ $item->price }}
                            </span>
                        </h4>
                    @endif
                @else
                    <h4 class="text-primary">
                        <span>免費</span>
                    </h4>
                @endif
            </div>

            @if(!$ownedLesson)
                <button type="button"
                    class="btn btn-primary position-relative z-3"
                    data-task="buy"
                    data-id="{{ $item->id }}"
                >
                    立即購買
                </button>
            @endif
        </div>
    </div>
</div>
