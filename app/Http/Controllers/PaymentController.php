<?php

namespace App\Http\Controllers;

use App\Http\Requests\Request;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\Voucher;
use App\Services\MikroTikService;
use App\Services\MomoService;
use App\Services\SmsService;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function initiate(Request $request, MomoService $momoService)
    {
        $request->validate([
            'phone' => 'required|string',
            'amount' => 'required|integer|min:100',
            'customer_name' => 'required|string',
            'router_id' => 'required|exists:routers,id',
            'site_id' => 'required|exists:sites,id',
        ]);

        $phone = $request->input('phone');
        $amount = $request->input('amount');
        $customerName = $request->input('customer_name');
        $routerId = $request->input('router_id');
        $siteId = $request->input('site_id');

        $customer = Customer::firstOrCreate([
            'phone' => $phone,
        ], [
            'name' => $customerName,
            'email' => null,
        ]);

        $reference = Str::uuid()->toString();

        Payment::create([
            'customer_id' => $customer->id,
            'reference' => $reference,
            'phone' => $phone,
            'amount' => $amount,
            'status' => 'pending',
        ]);

        $response = $momoService->requestToPay($phone, $amount, $reference);

        return response()->json([
            'message' => 'Request to pay initiated.',
            'reference' => $reference,
            'response' => $response,
        ], 201);
    }
}
