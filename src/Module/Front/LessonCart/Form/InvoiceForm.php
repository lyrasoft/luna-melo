<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Front\LessonCart\Form;

use Lyrasoft\Melo\Enum\InvoiceType;
use Lyrasoft\Melo\Enum\Payment;
use Lyrasoft\Melo\Features\Payment\MeloPaymentInterface;
use Lyrasoft\Melo\Features\Payment\PaymentComposer;
use Unicorn\Field\InlineField;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Form\Attributes\FormDefine;
use Windwalker\Form\Field\ListField;
use Windwalker\Form\Field\RadioField;
use Windwalker\Form\Field\TextField;
use Windwalker\Form\Form;

class InvoiceForm
{
    use TranslatorTrait;

    public function __construct(protected PaymentComposer $paymentComposer)
    {
    }

    #[FormDefine]
    public function main(Form $form): void
    {
        $form->add('invoice_vat', TextField::class)
            ->placeholder('請填寫統一編號')
            ->label('統一編號')
            ->addWrapperClass('col-6');

        $form->add('invoice_title', TextField::class)
            ->placeholder('請填寫發票抬頭')
            ->label('發票抬頭')
            ->addWrapperClass('col-6');

        $form->add('invoice_name', TextField::class)
            ->placeholder('請填寫真實姓名')
            ->label('收件人')
            ->addWrapperClass('col-6')
            ->required(true);

        $form->add('invoice_carrier', TextField::class)
            ->placeholder('請填寫電子發票載具')
            ->label('電子發票載具')
            ->addWrapperClass('col-6')
            ->required(true);

        $form->add('address_row', InlineField::class)
            ->label('發票寄送地址')
            ->attr('role', 'tw-city-selector')
            ->configureForm(function (Form $form) {
                $form->add('zip', TextField::class)
                    ->placeholder('郵遞區號')
                    ->required(true);

                $form->add('city', ListField::class)
                    ->required(true);

                $form->add('dist', ListField::class)
                    ->required(true);
            });

        $form->add('address', TextField::class)
            ->placeholder('請填寫地址')
            ->label('地址')
            ->required(true);

        $payments = $this->paymentComposer->getGateways()
            ->map(
                function (MeloPaymentInterface $payment) {
                    return $payment->getTitle($this->lang);
                }
            );

        $form->add('payment', ListField::class)
            ->registerOptions($payments);
    }
}
