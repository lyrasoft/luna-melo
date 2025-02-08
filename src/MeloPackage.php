<?php

declare(strict_types=1);

namespace Lyrasoft\Melo;

use Windwalker\Core\Application\ApplicationInterface;
use Windwalker\Core\Language\LangService;
use Windwalker\Core\Package\AbstractPackage;
use Windwalker\Core\Package\PackageInstaller;
use Windwalker\DI\Container;
use Windwalker\DI\ServiceProviderInterface;

class MeloPackage  extends AbstractPackage implements ServiceProviderInterface
{
    public function __construct(protected ApplicationInterface $app)
    {
        //
    }

    public function register(Container $container): void
    {
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
        $installer->installModules(
            [
                static::path("src/Module/Admin/Lesson/**/*") => "@source/Module/Admin/Lesson",
                static::path("src/Module/Admin/Option/**/*") => "@source/Module/Admin/Option",
                static::path("src/Module/Admin/Question/**/*") => "@source/Module/Admin/Question",
                static::path("src/Module/Admin/Segment/**/*") => "@source/Module/Admin/Segment",
                static::path("src/Module/Admin/Student/**/*") => "@source/Module/Admin/Student",
                static::path("src/Module/Admin/UserHomework/**/*") => "@source/Module/Admin/UserHomework",
                static::path("src/Module/Admin/UserLesson/**/*") => "@source/Module/Admin/UserLesson",
                static::path("src/Module/Admin/UserQuiz/**/*") => "@source/Module/Admin/UserQuiz",
            ],
            ['Lyrasoft\\Melo\\Module\\Admin' => 'App\\Module\\Admin'],
            ['modules', 'melo_admin'],
        );

        $installer->installModules(
            [
                static::path("src/Module/Admin/Order/**/*") => "@source/Module/Admin/Order",
            ],
            ['Lyrasoft\\Melo\\Module\\Admin' => 'App\\Module\\Admin'],
            ['modules', 'melo_order_admin'],
        );

        $installer->installModules(
            [
                static::path("src/Module/Front/Lesson/**/*") => "@source/Module/Front/Lesson",
                static::path("src/Module/Front/MyLesson/**/*") => "@source/Module/Front/MyLesson",
                static::path("src/Module/Front/MyLecture/**/*") => "@source/Module/Front/MyLecture",
            ],
            ['Lyrasoft\\Melo\\Module\\Front' => 'App\\Module\\Front'],
            ['modules', 'melo_front'],
        );

        $installer->installModules(
            [
                static::path("src/Module/Front/Cart/**/*") => "@source/Module/Front/Cart",
                static::path("src/Module/Front/Order/**/*") => "@source/Module/Front/Order",
            ],
            ['Lyrasoft\\Melo\\Module\\Front' => 'App\\Module\\Front'],
            ['modules', 'melo_order_front'],
        );

        $installer->installModules(
            [
                static::path("src/Module/Front/MyLecture/**/*") => "@source/Module/Front/MyLecture",
            ],
            ['Lyrasoft\\Melo\\Module\\Front' => 'App\\Module\\Front'],
            ['modules', 'teacher_front'],
        );

        $installer->installModules(
            [
                static::path("src/Module/Front/MyFavorite/**/*") => "@source/Module/Front/MyFavorite",
            ],
            ['Lyrasoft\\Melo\\Module\\Front' => 'App\\Module\\Front'],
            ['modules', 'favorite_lesson_front'],
        );

        $installer->installModules(
            [
                static::path("src/Entity/Lesson.php") => '@source/Entity',
                static::path("src/Entity/LessonCategoryMap.php") => '@source/Entity',
                static::path("src/Entity/Option.php") => '@source/Entity',
                static::path("src/Entity/Question.php") => '@source/Entity',
                static::path("src/Entity/Segment.php") => '@source/Entity',
                static::path("src/Entity/UserAnswer.php") => '@source/Entity',
                static::path("src/Entity/UserLessonMap.php") => '@source/Entity',
                static::path("src/Entity/UserSegmentMap.php") => '@source/Entity',
                static::path("src/Repository/LessonRepository.php") => '@source/Repository',
                static::path("src/Repository/OptionRepository.php") => '@source/Repository',
                static::path("src/Repository/QuestionRepository.php") => '@source/Repository',
                static::path("src/Repository/SegmentRepository.php") => '@source/Repository',
                static::path("src/Repository/UserLessonMapRepository.php") => '@source/Repository',
                static::path("src/Repository/UserSegmentMapRepository.php") => '@source/Repository',
            ],
            [
                'Lyrasoft\\Melo\\Entity' => 'App\\Entity',
                'Lyrasoft\\Melo\\Repository' => 'App\\Repository',
            ],
            ['modules', 'melo_model']
        );
    }

    public function config(string $name, ?string $delimiter = '.'): mixed
    {
        return $this->app->config('melo' . $delimiter . $name, $delimiter);
    }
}

