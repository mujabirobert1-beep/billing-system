<?php

namespace App\Services;

use GuzzleHttp\Client;

class MomoService
{
    private Client $client;
    private string $subscriptionKey;
    private string $apiUser;
    private string $apiKey;
    private string $environment;
    private string $baseUrl;

    public function __construct()
    {
        $this->subscriptionKey = env('MOMO_COLLECTION_SUB_KEY');
        $this->apiUser = env('MOMO_API_USER');
        $this->apiKey = env('MOMO_API_KEY');
        $this->environment = env('MOMO_ENVIRONMENT', 'sandbox');
        $this->baseUrl = env('MOMO_COLLECTION_URL');
        $this->client = new Client(['base_uri' => $this->baseUrl]);
    }

    public function requestToPay(string $phone, int $amount, string $reference, string $payerMessage = 'CloudiFi voucher payment'): array
    {
        $response = $this->client->post('/requesttopay', [
            'headers' => [
                'Ocp-Apim-Subscription-Key' => $this->subscriptionKey,
                'X-Target-Environment' => $this->environment,
                'Authorization' => 'Bearer ' . $this->apiKey,
                'X-Reference-Id' => $reference,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'amount' => (string) $amount,
                'currency' => 'UGX',
                'externalId' => $reference,
                'payer' => [
                    'partyIdType' => 'MSISDN',
                    'partyId' => $phone,
                ],
                'payerMessage' => $payerMessage,
                'payeeNote' => 'CloudiFi voucher purchase',
            ],
        ]);

        return json_decode((string) $response->getBody(), true);
    }
}
