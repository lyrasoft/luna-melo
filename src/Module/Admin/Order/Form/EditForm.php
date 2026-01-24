<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Order\Form;

use Lyrasoft\Melo\Data\AddressInfo;
use Lyrasoft\Melo\Enum\InvoiceType;
use Lyrasoft\Melo\Features\Payment\PaymentComposer;
use Unicorn\Field\InlineField;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Form\Attributes\Fieldset;
use Windwalker\Form\Attributes\FormDefine;
use Windwalker\Form\Attributes\NS;
use Windwalker\Form\Field\HiddenField;
use Windwalker\Form\Field\ListField;
use Windwalker\Form\Field\TextField;
use Windwalker\Form\Form;

class EditForm
{
    use TranslatorTrait;

    public function __construct(protected PaymentComposer $paymentComposer, protected ?AddressInfo $address = null)
    {
    }

    #[FormDefine]
    #[NS('item')]
    public function main(Form $form): void
    {
        $form->add('id', HiddenField::class);
    }

    #[FormDefine]
    #[Fieldset('invoice')]
    #[NS('item')]
    public function invoice(Form $form): void
    {
        $form->add('invoice_no', TextField::class)
            ->label('發票編號')
            ->disabled(true);

        $form->add('invoice_type', ListField::class)
            ->label('發票類型')
            ->registerFromEnums(InvoiceType::class);

        $form->add('invoice_data/name', TextField::class)
            ->label('購買人')
            ->showon(['item/invoice_type' => InvoiceType::IDV]);

        $form->add('invoice_data/carrier', TextField::class)
            ->label('載具編號')
            ->pattern('^/[\dA-Z0-9+-\.]{7}$')
            ->showon(['item/invoice_type' => InvoiceType::IDV]);

        $form->add('invoice_data/vat', TextField::class)
            ->label('統編')
            ->pattern('[0-9]{8}')
            ->showon(['item/invoice_type' => InvoiceType::COMPANY]);

        $form->add('invoice_data/title', TextField::class)
            ->label('抬頭')
            ->showon(['item/invoice_type' => InvoiceType::COMPANY]);

        $form->add('invoice_data/address', InlineField::class)
            ->label('地址')
            ->asGroup(true)
            ->addFilter('trim')
            ->widths(4, 4, 4, 'calc(100% + .75rem)')
            ->configureForm(
                function (Form $form) {
                    $form->add('city', ListField::class)
                        ->label('縣市')
                        ->attr('data-value', $this->address?->city ?? '');

                    $form->add('dist', ListField::class)
                        ->label('鄉鎮市區')
                        ->attr('data-value', $this->address?->dist ?? '');

                    $form->add('zip', TextField::class)
                        ->label('郵遞區號')
                        ->readonly(true);

                    $form->add('address', TextField::class)
                        ->placeholder('街道地址');
                }
            );
    }
}
