<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Segment;

use Lyrasoft\Melo\Entity\Segment;
use Unicorn\Aws\S3Service;
use Windwalker\Core\Database\ORMAwareTrait;
use Windwalker\DI\Attributes\Service;
use Windwalker\Utilities\StrNormalize;

#[Service]
class SegmentFileManager
{
    use ORMAwareTrait;

    public function __construct(protected S3Service $s3Service)
    {
    }

    public function deleteS3IfNoDuplicated(string $url, int $currentSegmentId = 0, string $field = 'src'): void
    {
        if (!str_starts_with($url, 'https://')) {
            throw new \RuntimeException('Only S3 url is allowed to delete.');
        }

        $field = StrNormalize::toSnakeCase($field);

        $count = $this->orm->from(Segment::class)
            ->where($field, $url)
            ->where('id', '!=', $currentSegmentId)
            ->count();

        if ($count === 0) {
            $this->s3Service->deleteFile($url);
        }
    }
}
