<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Module\Admin\Order\Form;

use Lyrasoft\Melo\Enum\OrderState;
use Lyrasoft\Melo\Enum\Payment;
use Lyrasoft\Luna\Field\UserModalField;
use Lyrasoft\Melo\Features\Payment\MeloPaymentInterface;
use Lyrasoft\Melo\Features\Payment\PaymentComposer;
use Unicorn\Enum\BasicState;
use Unicorn\Field\CalendarField;
use Unicorn\Field\InlineField;
use Unicorn\Field\SwitcherField;
use Windwalker\Core\Language\TranslatorTrait;
use Windwalker\Form\Attributes\Fieldset;
use Windwalker\Form\Attributes\FormDefine;
use Windwalker\Form\Attributes\NS;
use Windwalker\Form\Field\HiddenField;
use Windwalker\Form\Field\ListField;
use Windwalker\Form\Field\TextareaField;
use Windwalker\Form\Field\TextField;
use Windwalker\Form\Form;

class EditForm
{
    use TranslatorTrait;

    public function __construct(protected PaymentComposer $paymentComposer)
    {
    }

    #[FormDefine]
    #[Fieldset('basic')]
    #[NS('item')]
    public function basic(Form $form): void
    {
        $form->add('no', TextField::class)
            ->label('訂單編號')
            ->disabled(true);

        $form->add('state', ListField::class)
            ->label('訂單狀態')
            ->registerOptions(OrderState::getTransItems($this->lang));

        $payments = $this->paymentComposer->getGateways()
            ->map(
                function (MeloPaymentInterface $payment) {
                    return $payment->getTitle($this->lang);
                }
            );

        $form->add('payment', ListField::class)
            ->label('付款方式')
            ->registerOptions($payments)
            ->disabled(true);

        $form->add('created', CalendarField::class)
            ->label('購買時間')
            ->disabled(true);

        $form->add('id', HiddenField::class);
    }

    #[FormDefine]
    #[Fieldset('meta')]
    #[NS('user')]
    public function meta(Form $form): void
    {
        $form->add('name', TextField::class)
            ->label('訂購人')
            ->disabled(true);

        $form->add('phone', TextField::class)
            ->label('電話')
            ->disabled(true);

        $form->add('username', TextField::class)
            ->label('帳號')
            ->disabled(true);

        $form->add('email', TextField::class)
            ->label('信箱')
            ->disabled(true);
    }

    #[FormDefine]
    #[Fieldset('remit')]
    #[NS('remit')]
    public function remit(Form $form): void
    {
        $form->add('time', CalendarField::class)
            ->label('匯款時間')
            ->disabled(true);

        $form->add('account', TextField::class)
            ->label('匯款帳號後五碼')
            ->disabled(true);

        $form->add('note', TextareaField::class)
            ->label('備註')
            ->rows(5)
            ->disabled(true);
    }
}
