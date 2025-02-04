<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Lesson\Form;

use Lyrasoft\Luna\Field\CategoryListField;
use Lyrasoft\Luna\Field\TagListField;
use Lyrasoft\Luna\Field\UserModalField;
use Unicorn\Field\CalendarField;
use Unicorn\Field\SingleImageDragField;
use Unicorn\Field\SwitcherField;
use Unicorn\Field\TinymceEditorField;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Form\Attributes\Fieldset;
use Windwalker\Form\Attributes\FormDefine;
use Windwalker\Form\Attributes\NS;
use Windwalker\Form\Field\HiddenField;
use Windwalker\Form\Field\ListField;
use Windwalker\Form\Field\NumberField;
use Windwalker\Form\Field\RadioField;
use Windwalker\Form\Field\TextField;
use Windwalker\Form\Form;
use Windwalker\Query\Query;

class EditForm
{
    use TranslatorTrait;

    #[FormDefine]
    #[NS('item')]
    public function main(Form $form): void
    {
        $form->add('title', TextField::class)
            ->label($this->trans('unicorn.field.title'))
            ->addFilter('trim')
            ->required(true);

        $form->add('alias', TextField::class)
            ->label($this->trans('unicorn.field.alias'))
            ->addFilter('trim');

        $form->add('id', HiddenField::class);
    }

    #[FormDefine]
    #[Fieldset('basic')]
    #[NS('item')]
    public function basic(Form $form): void
    {
        $form->add('category_id', CategoryListField::class)
            ->label('分類')
            ->categoryType('lesson')
            ->option($this->trans('unicorn.select.placeholder'), '')
            ->configureQuery(
                function (Query $query) {
                    $query->where('level', 2);
                }
            )
            ->required(true);

        $form->add('sub_category_id', ListField::class)
            ->label('次分類')
            ->multiple(true);

        $form->add('tags', TagListField::class)
            ->label($this->trans('luna.article.field.tags'))
            ->multiple(true);

        $form->add('teacher_id', UserModalField::class)
            ->label('課程講師');

        $form->add('start_date', CalendarField::class)
            ->label('開課時間')
            ->format('Y-m-d');

        $form->add('end_date', CalendarField::class)
            ->label('課程結束日期')
            ->format('Y-m-d');

        $form->add('image', SingleImageDragField::class)
            ->label('課程封面')
            ->crop(true)
            ->width(560)
            ->height(400)
            ->uploadProfile('image');
    }

    #[FormDefine]
    #[Fieldset('meta')]
    #[NS('item')]
    public function meta(Form $form): void
    {
        $form->add('state', SwitcherField::class)
            ->label($this->trans('unicorn.field.published'))
            ->circle(true)
            ->color('success');

        $form->add('created', CalendarField::class)
            ->label($this->trans('unicorn.field.created'));

        $form->add('modified', CalendarField::class)
            ->label($this->trans('unicorn.field.modified'))
            ->disabled(true);

        $form->add('created_by', UserModalField::class)
            ->label($this->trans('unicorn.field.author'));

        $form->add('modified_by', UserModalField::class)
            ->label($this->trans('unicorn.field.modified_by'))
            ->disabled(true);
    }

    #[FormDefine]
    #[Fieldset('info')]
    #[NS('item')]
    public function info(Form $form): void
    {
        $form->add('price', NumberField::class)
            ->defaultValue(0)
            ->label('原價');

        $form->add('is_special', SwitcherField::class)
            ->label('是否特價')
            ->circle(true)
            ->color('success');

        $form->add('special_price', NumberField::class)
            ->defaultValue(0)
            ->label('特價');

        $form->add('is_free', SwitcherField::class)
            ->label('免費')
            ->circle(true)
            ->color('success');

        $form->add('is_step_by_step', RadioField::class)
            ->label('學生需要依照章節順序上課嗎？')
            ->option('是', '1')
            ->option('否', '0')
            ->required(true);

        $form->add('has_certificate', RadioField::class)
            ->label('課程證書')
            ->defaultValue('0')
            ->option('無證書', '0')
            ->option('有證書', '1');

        $form->add('pass_average_score', NumberField::class)
            ->label('所有測驗平均分數')
            ->step(1)
            ->min(0)
            ->max(100)
            ->defaultValue(0)
            ->help('如果要設定是所有章節的平均分數高於這個設定分數才是通過的話，請填寫分數在這個欄位');

        $form->add('pass_min_score', NumberField::class)
            ->label('所有測驗最低分數')
            ->step(1)
            ->min(0)
            ->max(100)
            ->defaultValue(0)
            ->help('如果要設定是所有章節的最低分數高於這個設定分數才是通過的話，請填寫分數在這個欄位');
    }

    #[FormDefine]
    #[Fieldset('content')]
    #[NS('item')]
    public function content(Form $form): void
    {
        $form->add('description', TinymceEditorField::class)
            ->label('課程簡介')
            ->editorOptions(
                [
                    'height' => 400,
                ]
            );

        $form->add('acquired', TinymceEditorField::class)
            ->label('能學到什麼')
            ->editorOptions(
                [
                    'height' => 400,
                ]
            );
    }
}
