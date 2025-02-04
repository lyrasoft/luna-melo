<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Segment;

use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Repository\SegmentRepository;
use Unicorn\Image\ImagePlaceholder;
use Unicorn\Script\UnicornScript;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Asset\AssetService;
use Windwalker\Core\Attributes\ViewMetadata;
use Windwalker\Core\Attributes\ViewModel;
use Windwalker\Core\Form\FormFactory;
use Windwalker\Core\Html\HtmlFrame;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\View\View;
use Windwalker\Core\View\ViewModelInterface;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;

/**
 * The SegmentEditView class.
 */
#[ViewModel(
    layout: 'segment-edit',
)]
class SegmentEditView implements ViewModelInterface
{
    use TranslatorTrait;

    public function __construct(
        protected ORM $orm,
        protected FormFactory $formFactory,
        protected Navigator $nav,
        #[Autowire] protected SegmentRepository $repository,
        protected UnicornScript $uniScript,
        #[Service]
        protected ImagePlaceholder $imageHelper,
    ) {
    }

    /**
     * Prepare
     *
     * @param  AppContext  $app
     * @param  View        $view
     *
     * @return  mixed
     */
    public function prepare(AppContext $app, View $view): mixed
    {
        $lessonId = $app->input('lesson_id');

        $this->uniScript->data(
            'segment.edit.props',
            [
                'lessonId' => (int) $lessonId
            ]
        );

        $this->uniScript->addRoute(
            'prepare_segments',
            $this->nav->to('ajax_segment')->var('task', 'prepareSegments')
        );

        $this->uniScript->addRoute(
            'save_segment',
            $this->nav->to('ajax_segment')->var('task', 'save')
        );

        $this->uniScript->addRoute(
            'delete_segment',
            $this->nav->to('ajax_segment')->var('task', 'delete')
        );

        $this->uniScript->addRoute(
            'reorder_segment',
            $this->nav->to('ajax_segment')->var('task', 'reorder')
        );

        $this->uniScript->addRoute(
            'prepare_questions',
            $this->nav->to('ajax_question')->var('task', 'prepareQuestions')
        );

        $this->uniScript->addRoute(
            'reorder_questions',
            $this->nav->to('ajax_question')->var('task', 'reorder')
        );

        $this->uniScript->addRoute(
            'save_question',
            $this->nav->to('ajax_question')->var('task', 'save')
        );

        $this->uniScript->addRoute(
            'delete_question',
            $this->nav->to('ajax_question')->var('task', 'delete')
        );

        $this->uniScript->addRoute(
            'prepare_options',
            $this->nav->to('ajax_option')->var('task', 'prepareOptions')
        );

        $this->uniScript->addRoute(
            'reorder_options',
            $this->nav->to('ajax_option')->var('task', 'reorder')
        );

        $this->uniScript->addRoute(
            'save_option',
            $this->nav->to('ajax_option')->var('task', 'save')
        );

        $this->uniScript->addRoute(
            'save_options',
            $this->nav->to('ajax_option')->var('task', 'saveOptions')
        );

        $this->uniScript->addRoute(
            'delete_option',
            $this->nav->to('ajax_option')->var('task', 'delete')
        );

        $this->uniScript->addRoute(
            'file_upload',
            $this->nav->to('file_upload')
        );

        $this->uniScript->addRoute(
            'image_upload',
            $this->nav->to('file_upload', ['profile' => 'image'])
        );

        $this->uniScript->addRoute(
            'video_file_upload',
            $this->nav->to('file_upload', ['profile' => 'video'])
        );

        $this->uniScript->data('defaultImage', $this->imageHelper->placeholder4x3());

        return compact('lessonId');
    }

    #[ViewMetadata]
    protected function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle(
            $this->trans('unicorn.title.edit', title: '課程章節')
        );
    }
}
