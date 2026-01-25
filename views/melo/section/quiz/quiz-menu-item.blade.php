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

use Lyrasoft\Luna\User\UserService;
use Lyrasoft\Melo\Data\SectionMenuItem;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Features\Section\AbstractSection;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $instance AbstractSection
 * @var $menu     SectionMenuItem
 */

$link = $menu->lesson->makeLink($nav, $menu->section->id);

if (!$app->service(UserService::class)->isLogin()) {
    $link = $nav->to('login')->withReturn();
}
?>

<a class="link-dark" href="#"
    data-segment-id="{{ $menu->section->id }}"
    data-segment-title="{{ $menu->section->title }}"
    data-chapter-index="{{ $menu->chapterIndex }}"
    data-section-index="{{ $menu->sectionIndex }}"
    data-type-index="{{ $menu->typeIndex }}"
    data-task="start-quiz">
    <div class="c-section-item {{ $menu->isActive ? 'active' : '' }}">
        <div class="c-section-item__inner">
            <div class="d-flex gap-2">
                <div>
                    <i class="fa-regular fa-circle-check"></i>
                </div>
                <div class="text-nowrap">
                    {{ $instance::title($lang) }} {{ $menu->typeIndex }}
                </div>
                <div>
                    {{ $menu->section->title }}
                </div>
            </div>
        </div>
    </div>
</a>
