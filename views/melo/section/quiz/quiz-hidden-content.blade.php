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

use Lyrasoft\Melo\Data\SectionContent;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Features\Section\AbstractSection;
use Lyrasoft\Melo\Features\Section\Quiz\QuizSection;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\DateTime\ChronosService;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\SystemUri;

/**
 * @var $instance  QuizSection
 * @var $content   SectionContent
 */
?>

@if (!QuizSection::$hiddenContentRendered)
    <script data-macro="melo.section.app.quiz" lang="ts" type="module">
        import { createSectionQuizApp } from '@lyrasoft/melo';
        import { data } from '@windwalker-io/unicorn-next';

        const questionDefines = data('question.defines');

        const app = await createSectionQuizApp({
            questionDefines
        });
        app.mount('quiz-content-app');
    </script>
    <quiz-content-app></quiz-content-app>

    @php(QuizSection::$hiddenContentRendered = true)
@endif
