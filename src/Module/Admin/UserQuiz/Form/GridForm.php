<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\UserQuiz\Form;

use Lyrasoft\Luna\Field\UserModalField;
use Lyrasoft\Melo\Features\Section\Quiz\QuizSection;
use Lyrasoft\Melo\Field\SectionListField;
use Unicorn\Enum\BasicState;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Form\Attributes\FormDefine;
use Windwalker\Form\Attributes\NS;
use Windwalker\Form\Field\ListField;
use Windwalker\Form\Field\SearchField;
use Windwalker\Form\Form;

class GridForm
{
    use TranslatorTrait;

    public function __construct(protected int $lessonId)
    {
    }

    #[FormDefine]
    #[NS('search')]
    public function search(Form $form): void
    {
        $form->add('*', SearchField::class)
            ->label($this->trans('unicorn.grid.search.label'))
            ->placeholder($this->trans('unicorn.grid.search.label'))
            ->onchange('this.form.submit()');
    }

    #[FormDefine]
    #[NS('filter')]
    public function filter(Form $form): void
    {
        $form->add('user_segment_map.user_id', UserModalField::class)
            ->label('學生')
            ->onchange('this.form.submit()');

        $form->add('user_segment_map.segment_id', SectionListField::class)
            ->label('章節')
            ->option($this->trans('unicorn.select.placeholder'), '')
            ->lessonId($this->lessonId)
            ->sectionType(QuizSection::id())
            ->onchange('this.form.submit()');
    }

    #[FormDefine]
    #[NS('batch')]
    public function batch(Form $form): void
    {
        $form->add('state', ListField::class)
            ->label($this->trans('unicorn.field.state'))
            ->option($this->trans('unicorn.select.no.change'), '')
            ->registerFromEnums(BasicState::class, $this->lang);
    }
}
