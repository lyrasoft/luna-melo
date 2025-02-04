# LYRASOFT ShopGo Package

<!-- TOC -->
* [Installation](#installation)
    * [Seeders](#seeders)
    * [Global Settings](#global-settings)
    * [Session](#session)
    * [Favorites Type](#favorites-type)
    * [Language Files](#language-files)
    * [CSS/JS](#cssjs)
    * [Add Cart Button](#add-cart-button)
* [Register Admin Menu](#register-admin-menu)
* [Frontend Available Routes](#frontend-available-routes)
<!-- TOC -->

## Installation

Install from composer

```shell
composer require lyrasoft/melo
```

ShopGo dependents on [lyrasoft/sequence](https://github.com/lyrasoft/luna-sequence) and
[lyrasoft/favorite](https://github.com/lyrasoft/luna-favorite) packages. Please read their README and configure them first.

Then copy files to project

```shell
php windwalker pkg:install lyrasoft/shopgo -t routes -t migrations -t seeders
php windwalker pkg:install lyrasoft/favorite -t routes -t migrations
```

### Seeders

Add these files to `resources/seeders/main.php`

```php
return [
    // ...
    
    __DIR__ . '/lesson-seeder.php',
    __DIR__ . '/option-seeder.php',
    __DIR__ . '/order-seeder.php',
    __DIR__ . '/question-seeder.php',
    __DIR__ . '/segment-seeder.php',
];
```

Add these types to `category-seeder.php`

```php
    static function () use ($seeder, $orm, $db) {
        $types = [
            // ...
            
            'lesson' => [
                'max_level' => 3,
                'number' => 30,
            ]
        ];
```

### Global Settings

Open `/etc/packages/melo.php`, you can configure there settings:

```php
<?php
// ...

return [
    'melo' => [
        // ...

        'checkout' => [
            'allow_anonymous' => false,
            'default_expiry' => '+7days',
            'receiver_roles' => ['superuser', 'manager', 'admin'],
        ],

        'order_no' => [
            'mode' => OrderNoMode::INCREMENT_ID,
            'prefix' => 'S',
            'hash_offsets' => 100000,
            'sequence_day_format' => 'Ymd',
            'maxlength' => 20
        ],

        'shop' => [
            'sitename' => 'Melo',
            'logo' => 'vendor/lyrasoft/melo/images/simular-logo.png'
        ],
    ]
];

```

After you configure the base settings, you should not change it after site release.
And then you can run migtaiotns/seeders, all orders No and faker locale will use this setting.

```shell
php windwalker mig:reset -fs
```

### Env

You can add `SHOPGO_MPDF_FONT_DIR` to configure Invoice PDF fonts position.

In developing, provide Mac default font dir:

```
SHOPGO_MPDF_FONT_DIR=/Library/Fonts/
```

You can change this dir after deployed to server.


### Session

As ShopGo may need to redirect to outside Payment service to process checkout, you must disable `SameSite` cookie poilicy
and set `secure` as `TRUE`.

```php
// etc/packages/session.php

return [
    'session' => [
        // ...

        'cookie_params' => [
            // ...
            'secure' => true, // <-- Set this to TRUE
            // ...
            'samesite' => CookiesInterface::SAMESITE_NONE, // Set this to `SAMESITE_NONE`
        ],
```

### Favorites Type

ShopGo will auto install `lyrasoft/favorite` and copy config file. You must add `product` to `allow_types` to allow
AJAX call.

```php
return [
    'favorite' => [
        // ...

        'ajax' => [
            'type_protect' => true,
            'allow_types' => [
                'article',
                'lesson' // <-- Add this
            ]
        ],
    ]
];
```

### Language Files

Add this line to admin & front middleware if you don't want to override languages:

```php
$this->lang->loadAllFromVendor('lyrasoft/melo', 'ini');
$this->lang->loadAllFromVendor('lyrasoft/favorite', 'ini');

```

Or run this command to copy languages files:

```shell
php windwalker pkg:install lyrasoft/melo -t lang
php windwalker pkg:install lyrasoft/favorite -t lang
```

### CSS/JS

ShopGo dependents on `lyrasoft/favorite`, you must add these vendors to `fusionfile.mjs`

```javascript
export async function install() {
    return installVendors(
        [
            // ...

            // Add these below
            'sweetalert',
        ],
        [
            // Add these 2 lines
            'lyrasoft/melo',
            'lyrasoft/favorite',
        ]
    );
}
```

### Add Cart Button

Currently ShopGo Beta has no cart button widget. You must add it to HTML manually.

You must includes these 2 attributes to make JS works:

- `[data-task=buy]`
- `[data-id=lesson-id]`

```php
<?php

?>
<button type="button"
    class="btn btn-primary position-relative z-3 rounded-pill"
    data-task="buy"
    data-id="{{ $item->getId() }}"
>
    立即購買
</button>
```

## Register Admin Menu

Edit `resources/menu/admin/sidemenu.menu.php`

```php
$menu->link('課程管理', '#')
    ->icon('fal fa-person-chalkboard');

$menu->registerChildren(
    function (MenuBuilder $menu) use ($nav, $lang) {
        // Category
        $menu->link('課程分類管理')
            ->to($nav->to('category_list', ['type' => 'lesson']))
            ->icon('fal fa-sitemap');

        // Lesson
        $menu->link($lang('unicorn.title.grid', title: '課程'))
            ->to($nav->to('lesson_list'))
            ->icon('fal fa-book');
    }
);

$menu->link($lang('unicorn.title.grid', title: '訂單'))
    ->to($nav->to('order_list'))
    ->icon('fal fa-file-invoice');

```

## Frontend Available Routes

- `lesson_list`
- `lesson_item`
- `my_lesson_list`
- `my_lecture_list`
- `order_list`
- `order_item`

