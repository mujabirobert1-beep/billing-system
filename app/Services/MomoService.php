<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MomoService
{
    private string $subscriptionKey;
    private string $apiUser;
    private string $apiKey;
    private string $environment;
    private string $baseUrl;

    public function __construct()
    {
        $this->subscriptionKey = env('MOMO_COLLECTION_SUB_KEY', 'f28182353fcd48299ee50f8e10d036a9');
        $this->apiUser = env('MOMO_API_USER', '8c6e4e8a-4a8a-4c1a-8a8a-4a8a4c1a8a8a');
        $this->apiKey = env('MOMO_API_KEY', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        $this->environment = env('MOMO_ENVIRONMENT', 'sandbox');
        $this->baseUrl = env('MOMO_COLLECTION_URL', 'https://sandbox.momodeveloper.mtn.com/collection/v1_0');
    }

    public function requestToPay(string $phone, int $amount, string $reference, string $payerMessage = 'CloudiFi voucher payment'): array
    {
        $response = Http::withHeaders([
            'Ocp-Apim-Subscription-Key' => $this->subscriptionKey,
            'X-Target-Environment' => $this->environment,
            'Authorization' => 'Bearer ' . $this->apiKey,
            'X-Reference-Id' => $reference,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/requesttopay", [
            'amount' => (string) $amount,
            'currency' => 'UGX',
            'externalId' => $reference,
            'payer' => [
                'partyIdType' => 'MSISDN',
                'partyId' => $phone,
            ],
            'payerMessage' => $payerMessage,
            'payeeNote' => 'CloudiFi voucher purchase',
        ]);

        return $response->json();
    }

    public function getStatus(string $reference): array
    {
        $response = Http::withHeaders([
            'Ocp-Apim-Subscription-Key' => $this->subscriptionKey,
            'X-Target-Environment' => $this->environment,
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->get("{$this->baseUrl}/requesttopay/{$reference}");

        return $response->json();
    }
}
