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

use Asika\BetterUnits\Duration;
use Brick\Math\BigDecimal;
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

if (!$menu->canAccess()) {
    if (!$app->service(UserService::class)->isLogin()) {
        $link = $nav->to('login')->withReturn();
    } else {
        $link = 'javascript:void(0)';
    }
}

$format = fn(BigDecimal $value) => sprintf('%02d', $value->toInt());

$durationText = Duration::from($menu->section->duration, 's')
    ->humanize(
        formats: [
            Duration::UNIT_HOURS => $format,
            Duration::UNIT_MINUTES => $format,
            Duration::UNIT_SECONDS => $format,
        ],
        divider: ':'
    );
?>
<a class="{{ $menu->canAccess() ? 'link-dark' : 'link-secondary disabled' }}"
    @attr('href', $link)
    data-segment-id="{{ $menu->section->id }}">
    <div class="c-section-item {{ $menu->isActive ? 'active' : '' }}">
        <div class="c-section-item__inner">
            <div class="d-flex gap-2">
                <div>
                    @if ($menu->canAccess())
                        <i class="fa-solid fa-circle-play"></i>
                    @else
                        <i class="fa-solid fa-lock"></i>
                    @endif
                </div>
                <div class="text-nowrap">
                    單元 {{ $menu->typeIndex }}
                </div>
                <div>
                    {{ $menu->section->title }}
                </div>
                <div class="text-nowrap">
                    {{ $durationText }}
                </div>
            </div>
        </div>
    </div>
</a>
