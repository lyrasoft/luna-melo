<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Features\Payment;

use Ecpay\Sdk\Factories\Factory;
use Ecpay\Sdk\Services\CheckMacValueService;

trait EcpayTrait
{
    abstract public function getEndpoint(string $path): string;

    public function isTest(): bool
    {
        return $this->getMerchantID() === '2000132';
    }

    public function getMerchantID(): string
    {
        return $this->getEnvCredentials()[0];
    }

    public function getHashKey(): string
    {
        return $this->getEnvCredentials()[1];
    }

    public function getHashIV(): string
    {
        return $this->getEnvCredentials()[2];
    }

    public function getEcpayFactory(string $hashMethod = CheckMacValueService::METHOD_SHA256): Factory
    {
        return new Factory(
            [
                'hashKey' => $this->getHashKey(),
                'hashIv' => $this->getHashIV(),
                'hashMethod' => $hashMethod,
            ]
        );
    }

    /**
     * @return  string[]
     */
    protected function getEnvCredentials(): array
    {
        return [
            env("MELO_ECPAY_MERCHANT_ID") ?: '2000132',
            env("MELO_ECPAY_HASH_KEY") ?:  '5294y06JbISpM5x9',
            env("MELO_ECPAY_HASH_IV") ?: 'v77hoKGq4kWxNNIS',
        ];
    }
}
