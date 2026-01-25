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

use Lyrasoft\Melo\Features\Section\Homework\HomeworkSection;
use Lyrasoft\Melo\Data\SectionContent;
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
 * @var $instance  HomeworkSection
 * @var $content   SectionContent
 */
?>

@if (!HomeworkSection::$hiddenContentRendered)
    <script data-macro="melo.section.app.homework" lang="ts" type="module">
        import { createSectionHomeworkApp } from '@lyrasoft/melo';

        const app = await createSectionHomeworkApp({});
        app.mount('homework-content-app');
    </script>
    <homework-content-app></homework-content-app>

    @php(HomeworkSection::$hiddenContentRendered = true)
@endif
