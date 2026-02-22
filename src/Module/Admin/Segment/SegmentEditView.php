<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Segment;

use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Features\Question\QuestionComposer;
use Lyrasoft\Melo\Features\Section\AbstractSection;
use Lyrasoft\Melo\Features\Section\SectionComposer;
use Lyrasoft\Melo\Features\Segment\SegmentFinder;
use Lyrasoft\Melo\MeloPackage;
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
    js: 'segment-edit.ts'
)]
class SegmentEditView implements ViewModelInterface
{
    use TranslatorTrait;

    public function __construct(
        protected ORM $orm,
        protected FormFactory $formFactory,
        protected Navigator $nav,
        #[Autowire] protected SegmentRepository $repository,
        protected AssetService $asset,
        protected UnicornScript $uniScript,
        protected SectionComposer $sectionComposer,
        protected QuestionComposer $questionComposer,
        protected MeloPackage $meloPackage,
        protected SegmentFinder $segmentFinder,
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
        $lessonId = (int) $app->input('lesson_id');

        $item = $this->orm->mustFindOne(Lesson::class, $lessonId);

        $segments = $this->segmentFinder->getChaptersSections((int) $lessonId);

        $sectionDefines = $this->getSectionDefines();
        $questionDefines = $this->getQuestionDefines();
        $config = [
            'maxBitrate' => $this->meloPackage->config('upload.video_max_bitrate'),
            'bitrateDocUrl' => $this->meloPackage->config('upload.video_bitrate_doc'),
        ];

        $this->uniScript->data(
            'segment.edit.props',
            compact(
                'segments',
                'lessonId',
                'sectionDefines',
                'questionDefines',
                'config',
            )
        );

        $this->uniScript->addRoute('@ajax_segment');
        $this->uniScript->addRoute('@ajax_question');
        $this->uniScript->addRoute('@lesson_file');

        $this->uniScript->addRoute(
            'file_upload',
            $this->nav->to('file_upload', ['profile' => $uploadProfiles['file'] ?? null])
        );

        $uploadProfiles = $this->meloPackage->config('upload_profiles');

        $this->uniScript->addRoute(
            'image_upload',
            $this->nav->to('file_upload', ['profile' => $uploadProfiles['image'] ?? 'image'])
        );

        $s3Profile = $uploadProfiles['s3_multipart_storage'] ?? 's3';

        // $this->uniScript->addRoute(
        //     'video_file_upload',
        //     $this->nav->to('file_upload', ['profile' => $s3Profile])
        // );

        $this->uniScript->data('defaultImage', $this->imageHelper->placeholder4x3());
        $this->uniScript->data(
            'video.upload.profile',
            $s3Profile
        );

        return compact('lessonId', 'item');
    }

    #[ViewMetadata]
    protected function prepareMetadata(HtmlFrame $htmlFrame): void
    {
        $htmlFrame->setTitle(
            $this->trans('unicorn.title.edit', title: '課程章節')
        );
    }

    /**
     * @return  array|array[]
     */
    public function getSectionDefines(): array
    {
        $sectionDefines = $this->sectionComposer->getDefines();

        return array_map(
            function (string $sectionClass) {
                /** @var class-string<AbstractSection> $sectionClass */

                return [
                    'id' => $sectionClass::id(),
                    'icon' => $sectionClass::icon(),
                    'title' => $sectionClass::title($this->lang),
                    'description' => $sectionClass::description($this->lang),
                    'vueComponentUrl' => $sectionClass::adminVueComponentUrl($this->asset),
                    'vueComponentName' => $sectionClass::adminVueComponentName(),
                ];
            },
            $sectionDefines
        );
    }

    /**
     * @return  array|array[]
     */
    public function getQuestionDefines(): array
    {
        $defines = $this->questionComposer->getDefines();

        return array_map(
            function (string $className) {
                /** @var class-string<AbstractSection> $className */

                return [
                    'id' => $className::id(),
                    'icon' => $className::icon(),
                    'title' => $className::title($this->lang),
                    'description' => $className::description($this->lang),
                    'vueComponentUrl' => $className::adminVueComponentUrl($this->asset),
                    'vueComponentName' => $className::adminVueComponentName(),
                ];
            },
            $defines
        );
    }
}
