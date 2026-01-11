<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Segment;

use Lyrasoft\Melo\Entity\Segment;
use Lyrasoft\Melo\Features\Segment\SegmentFileManager;
use Lyrasoft\Melo\Repository\SegmentRepository;
use Unicorn\Attributes\Ajax;
use Unicorn\Aws\S3MultipartUploadControllerTrait;
use Unicorn\Aws\S3MultipartUploader;
use Unicorn\Aws\S3Service;
use Unicorn\Controller\AjaxControllerTrait;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\Filter;
use Windwalker\Core\Attributes\JsonApi;
use Windwalker\Core\Attributes\Method;
use Windwalker\Core\Attributes\Request\Input;
use Windwalker\Data\Collection;
use Windwalker\DI\Attributes\Autowire;
use Windwalker\DI\Attributes\Inject;
use Windwalker\ORM\ORM;

#[Controller()]
class SegmentController
{
    use AjaxControllerTrait;
    use S3MultipartUploadControllerTrait;

    #[Ajax]
    #[Method('POST')]
    public function save(
        ORM $orm,
        #[Input] array $item,
    ): object {
        $segment = $orm->toEntity(Segment::class, $item);

        if (!$segment->id) {
            $maxOrdering = (int) $orm->select()
                ->selectRaw('MAX(ordering) AS max_ordering')
                ->from(Segment::class)
                ->where('parent_id', $segment->parentId)
                ->where('lesson_id', $segment->lessonId)
                ->result();

            $segment->ordering = $maxOrdering + 1;
        }

        return $orm->saveOne(Segment::class, $segment);
    }

    #[Ajax]
    #[Method('POST')]
    public function delete(
        AppContext $app,
        ORM $orm,
        #[Input, Filter('int')] int $id,
    ): void {
        $orm->deleteBatch(Segment::class, ['id' => $id]);
    }

    #[Ajax]
    #[Method('POST')]
    public function reorder(
        AppContext $app,
        #[Autowire] SegmentRepository $repository,
        #[Input] array $orders,
    ): void {
        $repository->createReorderAction()->reorder($orders);
    }

    #[Ajax]
    #[Method('DELETE')]
    public function deleteFile(
        SegmentFileManager $segmentFileManager,
        #[Input, Filter('int')] int $id,
        #[Input] string $field,
        #[Input] string $url,
    ): bool {
        if (!$url) {
            return false;
        }

        $segmentFileManager->deleteS3IfNoDuplicated($url, $id, $field);

        return true;
    }

    protected function configureUploader(S3MultipartUploader $uploader): void
    {
        $uploader->acl = S3MultipartUploader::ACL_AUTHENTICATED_READ;
    }
}
