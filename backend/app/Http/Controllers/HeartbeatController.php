<?php

namespace App\Http\Controllers;

use App\Jobs\CheckRouterStatus;
use App\Models\HeartbeatLog;
use App\Models\Router;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Mail;

class HeartbeatController extends Controller
{
    public function handle(Request $request, SmsService $smsService)
    {
        $router = Router::find($request->input('router_id'));
        if (! $router) {
            return Response::json(['error' => 'Router not found.'], 404);
        }

        $router->update([
            'status' => 'online',
            'last_seen' => now(),
            'cpu' => $request->input('cpu'),
            'ram' => $request->input('ram'),
            'uptime' => $request->input('uptime'),
        ]);

        HeartbeatLog::create([
            'router_id' => $router->id,
            'status' => 'online',
            'cpu' => $request->input('cpu'),
            'ram' => $request->input('ram'),
        ]);

        CheckRouterStatus::dispatch();

        return Response::json(['message' => 'Heartbeat recorded.']);
    }

    public function checkStatus(SmsService $smsService)
    {
        CheckRouterStatus::dispatch();
        return Response::json(['message' => 'Router status check scheduled.']);
    }
}
