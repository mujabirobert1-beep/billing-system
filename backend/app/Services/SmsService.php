<?php

namespace App\Services;

use GuzzleHttp\Client;

class SmsService
{
    private Client $client;
    private string $username;
    private string $apiKey;
    private string $from;
    private string $baseUrl;

    public function __construct()
    {
        $this->username = env('AT_USERNAME');
        $this->apiKey = env('AT_API_KEY');
        $this->from = env('AT_SENDER');
        $this->baseUrl = env('AT_BASE_URL');
        $this->client = new Client();
    }

    public function sendSms(string $phone, string $message): array
    {
        $response = $this->client->post($this->baseUrl, [
            'headers' => [
                'apiKey' => $this->apiKey,
                'Content-Type' => 'application/x-www-form-urlencoded',
            ],
            'form_params' => [
                'username' => $this->username,
                'to' => $phone,
                'message' => $message,
                'from' => $this->from,
            ],
        ]);

        return json_decode((string) $response->getBody(), true);
    }
}
