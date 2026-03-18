<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Invoice;

use Lyrasoft\Luna\Entity\User;
use Lyrasoft\Melo\Entity\MeloOrder;
use Lyrasoft\Melo\Entity\MeloOrderItem;
use Lyrasoft\Melo\Enum\InvoiceType;
use Lyrasoft\Melo\Features\Order\OrderFinder;
use Lyrasoft\Melo\Features\Payment\EcpayTrait;
use Windwalker\Core\Manager\Logger;
use Windwalker\DI\Attributes\Service;
use Windwalker\ORM\ORM;
use Windwalker\Utilities\Utf8String;

#[Service]
class EcpayInvoice
{
    use EcpayTrait;

    public function __construct(
        protected ORM $orm,
        protected OrderFinder $orderFinder,
    ) {
    }

    /**
     * @param  MeloOrder                     $order
     * @param  iterable<MeloOrderItem>|null  $orderItems
     *
     * @return  void
     *
     * @throws \ReflectionException
     */
    public function issue(MeloOrder $order, ?iterable $orderItems = null): void
    {
        $no = $order->paymentNo;

        if ($this->isTest()) {
            $no .= 'R' . random_int(1, 9999);
        } elseif ($order->invoiceNo) {
            return;
        }

        /** @var MeloOrderItem[] $orderItems */
        $orderItems ??= $this->orderFinder->getOrderItems($order);

        $items = [];

        foreach ($orderItems as $orderItem) {
            $item['ItemName'] = Utf8String::substr($orderItem->title, 0, 100);
            $item['ItemCount'] = '1';
            $item['ItemWord'] = '堂';
            $item['ItemPrice'] = $orderItem->price;
            $item['ItemTaxType'] = '1';
            $item['ItemAmount'] = $orderItem->total;

            $items[] = $item;
        }

        // Todo: Minus the discount amount to the last item.

        $invoice = $order->invoiceData;

        $isCompany = $order->invoiceType === InvoiceType::COMPANY;
        $print = $isCompany ? 1 : 0;

        $user = $this->orm->findOne(User::class, ['id' => $order->userId]);

        $data = [
            'MerchantID' => $this->getMerchantID(),
            'RelateNumber' => $no,
            'CustomerIdentifier' => $invoice->vat ?: '',
            'CustomerEmail' => $user?->email ?? '',
            'CarrierType' => $print ? '' : 1,
            'CarrierNum' => '',
            'Donation' => 0,
            'Print' => $print,
            'CustomerName' => $invoice->title,
            'Items' => $items,
            'SalesAmount' => (int) $order->total,
            'DelayDay' => 0,
            'InvType' => '07',
            'vat' => '1',
            'TaxType' => '1',
        ];

        if (!$isCompany && $invoice->carrier) {
            $data['CarrierNum'] = $invoice->carrier;
            $data['CarrierType'] = 3;
        }

        $data['CustomerAddr'] = $print
            ? $invoice->address->zip . $invoice->address->format()
            : '';

        $order->invoiceData->args = $data;

        $res = $this->execute(
            'B2CInvoice/Issue',
            $data
        );

        if ((int) $res['Data']['RtnCode'] !== 1) {
            throw new \RuntimeException($res['Data']['RtnMsg']);
        }

        $order->invoiceData->info = $res['Data'];
        $order->invoiceData->issuedAt = \Windwalker\try_chronos($res['Data']['InvoiceDate'], 'Asia/Taipei');

        $order->invoiceNo = $res['Data']['InvoiceNo'];

        $this->orm->updateOne($order);
    }

    public function print(string $invoiceNo, string $invoiceDate, array $extra = []): string
    {
        $data = [
            'MerchantID' => $this->getMerchantID(),
            'InvoiceNo' => $invoiceNo,
            'InvoiceDate' => $invoiceDate,
            // 'InvoiceDate' => '2025/02/01',
            'PrintStyle' => 1,
            'IsShowingDetail' => 1,
            ...$extra
        ];

        $res = $this->execute('B2CInvoice/InvoicePrint', $data);

        if ((int) $res['Data']['RtnCode'] !== 1) {
            throw new \RuntimeException($res['Data']['RtnMsg']);
        }

        return $res['Data']['InvoiceHtml'];
    }

    public function execute(string $action, array $data): array
    {
        $input = [
            'MerchantID' => $this->getMerchantID(),
            'RqHeader' => [
                'Timestamp' => time(),
            ],
            'Data' => $data,
        ];

        $factory = $this->getEcpayFactory();

        try {
            return $factory->create('PostWithAesJsonResponseService')->post(
                $input,
                $this->getEndpoint($action)
            );
        } catch (\Throwable $e) {
            Logger::error('melo/invoice-error', $e->getMessage());
            throw new \RuntimeException('Ecpay API Error: ' . $e->getMessage(), 400, previous: $e);
        }
    }

    protected function getEnvCredentials(): array
    {
        return [
            env("MELO_ECPAY_MERCHANT_ID") ?: '2000132',
            env("MELO_ECPAY_INVOICE_KEY") ?:  'ejCk326UnaZWKisg',
            env("MELO_ECPAY_INVOICE_IV") ?: 'q9jcZX8Ib9LM8wYk',
        ];
    }

    public function getEndpoint(?string $path = null): string
    {
        if ($this->isTest()) {
            $uri = "https://einvoice-stage.ecpay.com.tw/";
        } else {
            $uri = "https://einvoice.ecpay.com.tw/";
        }

        if ($path) {
            $uri .= ltrim($path, '/');
        }

        return $uri;
    }
}
