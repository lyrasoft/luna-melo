<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Lesson;

use Psr\Http\Message\ResponseInterface;
use Unicorn\Aws\S3Service;
use Windwalker\Core\Application\AppContext;
use Windwalker\Core\Attributes\Controller;
use Windwalker\Core\Attributes\Request\Input;
use Windwalker\Core\Router\Navigator;
use Windwalker\Core\Router\NavOptions;

use function Windwalker\response;

#[Controller]
class LessonFileController
{
    public function index(
        AppContext $app,
        #[Input] string $task
    ) {
        return $app->call($this->$task(...));
    }

    public function previewFile(
        S3Service $s3Service,
        Navigator $nav,
        #[Input] string $url,
        #[Input] ?string $filename = null,
    ): ResponseInterface {
        if (str_contains($url, 'sintel')) {
            return response()->redirectOutside($url);
        }

        $args = [];

        if (str_ends_with($url, '.vtt')) {
            $args['ResponseContentType'] = 'text/vtt; charset=utf-8';
        }

        if ($filename) {
            $result = $s3Service->getPreSignedUrlWithFilename($url, '10minutes', $filename, $args);
        } else {
            $result = $s3Service->getPreSignedUrl($url, '10minutes', $args);
        }

        return response()->redirectOutside($result);
    }
}
