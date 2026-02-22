<?php

declare(strict_types=1);

namespace Lyrasoft\Melo;

use Lyrasoft\Melo\Component\LessonEditLayoutComponent;
use Lyrasoft\Melo\Entity\Lesson;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\Question;
use Lyrasoft\Melo\Entity\Segment;
use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Package\AbstractPackage;
use Windwalker\Core\Package\PackageInstaller;
use Windwalker\DI\Container;
use Windwalker\DI\ServiceProviderInterface;
use Windwalker\Utilities\StrNormalize;

class MeloPackage  extends AbstractPackage implements ServiceProviderInterface
{
    public function __construct(protected ApplicationInterface $app)
    {
        //
    }

    public function register(Container $container): void
    {
        $container->share(static::class, fn () => $this);

        $container->mergeParameters(
            'renderer.paths',
            [
                static::path('/views')
            ],
            Container::MERGE_OVERRIDE
        );

        $container->mergeParameters(
            'renderer.edge.components',
            [
                'cart-items' => '@cart-items',
                'lesson-edit-layout' => LessonEditLayoutComponent::class
            ],
        );
    }

    public function bootBeforeRequest(Container $container): void
    {
        // Lang
        if ($container->has(LangService::class)) {
            $container->get(LangService::class)
                ->loadAllFromPath(__DIR__ . '/../resources/languages', 'ini');
        }
    }

    public function install(PackageInstaller $installer): void
    {
        $installer->installConfig(static::path('etc/*.php'), 'config');
        $installer->installLanguages(static::path('resources/languages/**/*.ini'), 'lang');
        $installer->installMigrations(static::path('resources/migrations/**/*'), 'migrations');
        $installer->installSeeders(static::path('resources/seeders/**/*'), 'seeders');
        $installer->installRoutes(static::path('routes/**/*.php'), 'routes');
        $installer->installViews(static::path('views/**/*.blade.php'), 'views');

        // Modules
        $installer->installMVCModules(Lesson::class);
        $installer->installMVCModules(MeloOrder::class);
        $installer->installModules(
            [
                static::path("src/Entity/MeloOrderItem.php") => '@source/Entity',
                static::path("src/Entity/MeloOrderHistory.php") => '@source/Entity',
                static::path("src/Entity/MeloOrderTotal.php") => '@source/Entity',
            ],
            [
                'Lyrasoft\\Melo\\Entity' => 'App\\Entity',
                'Lyrasoft\\Melo\\Repository' => 'App\\Repository',
            ],
            ['modules', 'melo_order_model']
        );
        $installer->installMVCModules(Question::class, ['Admin']);
        $installer->installMVCModules(Segment::class, ['Admin']);
        $installer->installMVCModules('Student', ['Admin']);
        $installer->installMVCModules('UserHomework', ['Admin']);
        $installer->installMVCModules('UserLesson', ['Admin']);
        $installer->installMVCModules('UserQuiz', ['Admin']);
        $installer->installMVCModules('Checkout', ['Front'], false);
        $installer->installMVCModules('LessonCart', ['Front'], false);
        $installer->installMVCModules('MyLecture', ['Front'], false);
        $installer->installMVCModules('MyLesson', ['Front'], false);

        $folders = [
            'types',
            'shared',
        ];

        foreach ($folders as $folder) {
            $installer->installFiles(
                static::path("assets/src/$folder/**/*"),
                "resources/assets/src/melo/$folder",
                ['melo_vue', 'melo_vue_base']
            );
        }

        $modules = [
            'cart',
            'lesson-homeworks',
            'section-homework',
            'section-quiz',
            'segment-editor',
        ];

        foreach ($modules as $module) {
            $installer->installFiles(
                static::path("assets/src/modules/$module/**/*"),
                "resources/assets/src/melo/modules/$module",
                ['melo_vue', 'melo_vue_' . StrNormalize::toSnakeCase($module)]
            );
        }
    }

    public function config(string $name, ?string $delimiter = '.'): mixed
    {
        return $this->app->config('melo' . $delimiter . $name, $delimiter);
    }
}

