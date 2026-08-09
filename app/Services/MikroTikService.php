<?php

namespace App\Services;

use RouterOS\Client;
use RouterOS\Query;
use RouterOS\Streams\Stream;

class MikroTikService
{
    public function createVoucher(string $routerIp, string $username, string $password, string $profile = '1Day_5000'): array
    {
        $client = new Client([
            'host' => $routerIp,
            'user' => env('MIKROTIK_USER', 'admin'),
            'pass' => env('MIKROTIK_PASSWORD', ''),
            'port' => env('MIKROTIK_PORT', 8728),
        ]);

        $stream = $client->connect();
        $query = new Query('/ip/hotspot/user/add');
        $query->equal('name', $username)
              ->equal('password', $password)
              ->equal('profile', $profile);

        $stream->exec($query);
        $response = $stream->read();
        $client->disconnect();

        return $response;
    }

    public function getActiveUsers(string $routerIp): array
    {
        $client = new Client([
            'host' => $routerIp,
            'user' => env('MIKROTIK_USER', 'admin'),
            'pass' => env('MIKROTIK_PASSWORD', ''),
            'port' => env('MIKROTIK_PORT', 8728),
        ]);

        $stream = $client->connect();
        $query = new Query('/ip/hotspot/active/print');
        $stream->exec($query);
        $response = $stream->read();
        $client->disconnect();

        return $response;
    }
}
