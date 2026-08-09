<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SmsService
{
    private string $username;
    private string $apiKey;
    private string $from;
    private string $baseUrl;

    public function __construct()
    {
        $this->username = env('AT_USERNAME', 'sandbox');
        $this->apiKey = env('AT_API_KEY', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        $this->from = env('AT_SENDER', 'CloudiFi');
        $this->baseUrl = env('AT_BASE_URL', 'https://api.africastalking.com/version1/messaging');
    }

    public function sendSms(string $phone, string $message): array
    {
        $response = Http::withHeaders([
            'apiKey' => $this->apiKey,
            'Content-Type' => 'application/x-www-form-urlencoded',
        ])->asForm()->post($this->baseUrl, [
            'username' => $this->username,
            'to' => $phone,
            'message' => $message,
            'from' => $this->from,
        ]);

        return $response->json();
    }
}
