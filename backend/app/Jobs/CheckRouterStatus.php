<?php

namespace App\Jobs;

use App\Models\Router;
use App\Services\SmsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class CheckRouterStatus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(SmsService $smsService): void
    {
        $offlineThreshold = now()->subMinutes(2);
        $routers = Router::where('last_seen', '<', $offlineThreshold)
            ->where('status', '!=', 'offline')
            ->get();

        foreach ($routers as $router) {
            $router->update(['status' => 'offline']);
            $reseller = $router->site->reseller;
            $message = "CloudiFi alert: {$router->name} at {$router->site->name} is offline.";
            $smsService->sendSms($reseller->phone, $message);
            Mail::raw($message, function ($mail) use ($reseller) {
                $mail->to($reseller->email)->subject('CloudiFi router offline alert');
            });
        }
    }
}
