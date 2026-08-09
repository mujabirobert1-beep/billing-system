<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Payment;
use App\Models\Router;
use App\Models\Voucher;
use App\Services\MikroTikService;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CallbackController extends Controller
{
    public function handle(Request $request, MikroTikService $mikrotikService, SmsService $smsService)
    {
        $payload = $request->json()->all();

        $reference = $payload['externalId'] ?? $payload['transactionId'] ?? null;
        $status = strtolower($payload['status'] ?? '');
        $phone = preg_replace('/\D+/', '', $payload['payer']['partyId'] ?? $request->input('phone', ''));
        $momoName = $payload['payer']['payerName'] ?? null;

        if (! $reference) {
            return response()->json(['error' => 'Reference missing.'], 400);
        }

        $payment = Payment::where('reference', $reference)->first();
        if (! $payment) {
            return response()->json(['error' => 'Payment not found.'], 404);
        }

        $payment->update(['status' => $status, 'momo_name' => $momoName, 'phone' => $phone]);

        if ($status !== 'successful' && $status !== 'paid') {
            return response()->json(['message' => 'Payment recorded, awaiting successful status.']);
        }

        $customer = Customer::firstOrCreate(['phone' => $phone], ['name' => $momoName ?? 'Unknown']);

        $router = Router::find($payment->router_id);
        if (! $router) {
            return response()->json(['error' => 'Router not configured for voucher creation.'], 500);
        }

        $voucherCode = strtoupper(Str::random(8));
        $voucherPassword = $voucherCode;
        $profile = '1Day_5000';

        $mikrotikService->createVoucher($router->ip, $voucherCode, $voucherPassword, $profile);

        $voucher = Voucher::create([
            'code' => $voucherCode,
            'password' => $voucherPassword,
            'profile' => $profile,
            'customer_id' => $customer->id,
            'router_id' => $router->id,
            'site_id' => $router->site_id,
            'price' => $payment->amount,
            'status' => 'unused',
        ]);

        $smsBody = "CloudiFi voucher: {$voucherCode}. Password: {$voucherPassword}. Profile: {$profile}.";
        $smsService->sendSms($phone, $smsBody);

        return response()->json(['message' => 'Voucher created and SMS sent.', 'voucher' => $voucher]);
    }
}
