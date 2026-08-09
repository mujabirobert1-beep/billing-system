<?php

namespace App\Http\Controllers;

use App\Http\Requests\DataUsageRequest;
use App\Models\Customer;
use App\Models\DataUsage;
use App\Models\Router;
use Illuminate\Support\Facades\Response;

class DataUsageController extends Controller
{
    public function record(DataUsageRequest $request)
    {
        $router = Router::find($request->router_id);
        if (! $router) {
            return Response::json(['error' => 'Router not found.'], 404);
        }

        $customer = Customer::find($request->customer_id);
        if (! $customer) {
            return Response::json(['error' => 'Customer not found.'], 404);
        }

        $dataUsage = DataUsage::create([
            'customer_id' => $customer->id,
            'router_id' => $router->id,
            'bytes_up' => $request->bytes_up,
            'bytes_down' => $request->bytes_down,
            'online' => $request->online,
            'last_update' => now(),
        ]);

        return Response::json(['message' => 'Data usage recorded.', 'data_usage' => $dataUsage]);
    }
}
