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

use Lyrasoft\Melo\Data\SectionContent;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Features\Section\AbstractSection;
use Lyrasoft\Melo\Features\VideoService;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $instance  AbstractSection
 * @var $content   SectionContent
 */

$videoService = $app->service(VideoService::class);

?>
<script data-macro="section.video.content" lang="ts" type="module">
    import { injectCssToDocument } from '@windwalker-io/unicorn-next';
    import Plyr from 'plyr';
    import css from 'plyr/dist/plyr.css?inline';

    const player = new Plyr('#section-player');
    injectCssToDocument(css);
</script>

<div class="film" id="attend-video">
    @if($videoService->isCloudVideo($content->section->src))
        <div id="section-player" data-plyr-provider="youtube"
            data-plyr-embed-id="{{ $videoService->getYoutubeEmbedId($content->section->src) }}"
            width="100%"
            height="450"
        >
        </div>
    @else
        <video class="rounded" id="section-player" width="100%" height="450"
            controls preload="metadata" crossorigin="anonymous"
            controlsList="nodownload">
            <source src="{{ $nav->to('section_file')->id($content->section->id) }}" type="video/mp4">
            @if($content->section->captionSrc)
                <track label="中文" kind="subtitles" srclang="zh"
                    src="{{ $nav->to('segment_file')->id($content->section->id)->var('field', 'caption') }}"
                    default>
            @endif
        </video>
    @endif
</div>
