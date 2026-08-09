<?php

namespace App\Http\Controllers;

use App\Models\HeartbeatLog;
use App\Models\Router;
use App\Models\Reseller;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class HeartbeatController extends Controller
{
    public function handle(Request $request, SmsService $smsService)
    {
        $routerId = $request->input('router_id');
        $cpu = $request->input('cpu');
        $ram = $request->input('ram');
        $identity = $request->input('id');

        if (! $routerId && ! $identity) {
            return response()->json(['error' => 'router_id or id is required.'], 400);
        }

        $router = $routerId ? Router::find($routerId) : Router::where('name', $identity)->first();
        if (! $router) {
            return response()->json(['error' => 'Router not found.'], 404);
        }

        $router->update([
            'status' => 'online',
            'last_seen' => now(),
            'cpu' => $cpu,
            'ram' => $ram,
            'uptime' => $request->input('uptime'),
        ]);

        HeartbeatLog::create([
            'router_id' => $router->id,
            'status' => $router->status,
            'cpu' => $cpu,
            'ram' => $ram,
        ]);

        $offlineThreshold = now()->subMinutes(2);
        $offlineRouters = Router::where('status', 'online')->where('last_seen', '<', $offlineThreshold)->get();
        foreach ($offlineRouters as $offlineRouter) {
            $offlineRouter->update(['status' => 'offline']);
            $reseller = $offlineRouter->site->reseller;
            $message = "CloudiFi alert: {$offlineRouter->name} is offline.";
            $smsService->sendSms($reseller->phone, $message);
            Mail::raw($message, function ($mail) use ($reseller) {
                $mail->to($reseller->email)->subject('CloudiFi router offline alert');
            });
        }

        return response()->json(['message' => 'Heartbeat recorded.']);
    }
}
