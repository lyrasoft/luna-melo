<?php

/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2024 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Lyrasoft\Melo\Service;

use Windwalker\DI\Attributes\Service;

/**
 * The VideoService class.
 */
#[Service]
class VideoService
{
    protected const PROVIDERS = [
        'youtube',
        'vimeo',
        'dailymotion',
    ];

    /**
     * @param  string  $url
     *
     * @return  bool
     */
    public function isFile(string $url): bool
    {
        return $url !== '' && !$this->isCloudVideo($url);
    }

    /**
     * @param  string  $url
     *
     * @return  bool
     */
    public function isCloudVideo(string $url): bool
    {
        if ($url === '') {
            return false;
        }

        foreach (static::PROVIDERS as $provider) {
            if (strpos($url, $provider)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param  string  $src
     *
     * @return  mixed
     */
    public function getYoutubeEmbedId(string $src): mixed
    {
        $urlParts = parse_url($src);

        parse_str($urlParts['query'], $query);

        return $query['v'] ?? null;
    }
}
