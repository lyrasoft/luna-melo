<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features;

use Lyrasoft\Luna\Access\AccessService;
use Lyrasoft\Melo\MeloPackage;
use Windwalker\DI\Attributes\Service;

#[Service]
class TeacherService
{
    public function __construct(protected MeloPackage $melo, protected AccessService $accessService)
    {
    }

    public function getRoleStrings(): array
    {
        return (array) ($this->melo->config('teacher.roles') ?: []);
    }

    public function getRoles(): array
    {
        $roleStrings = $this->getRoleStrings();

        $roles = $this->accessService->getRoles();

        return array_filter(
            $roles,
            static fn ($role) => in_array($role->id, $roleStrings, true)
        );
    }
}
