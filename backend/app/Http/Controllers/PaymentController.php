<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentInitiateRequest;
use App\Models\Customer;
use App\Models\Payment;
use App\Services\MomoService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Response;

class PaymentController extends Controller
{
    public function initiate(PaymentInitiateRequest $request, MomoService $momoService)
    {
        $customer = Customer::firstOrCreate(
            ['phone' => $request->phone],
            ['name' => $request->customer_name, 'email' => $request->email]
        );

        $reference = Str::uuid()->toString();

        $payment = Payment::create([
            'customer_id' => $customer->id,
            'reference' => $reference,
            'phone' => $request->phone,
            'amount' => $request->amount,
            'status' => 'pending',
            'router_id' => $request->router_id,
        ]);

        $response = $momoService->requestToPay($request->phone, $request->amount, $reference);

        return Response::json([
            'message' => 'Request to pay initiated.',
            'reference' => $reference,
            'momo_response' => $response,
            'payment' => $payment,
        ], 201);
    }
}
