<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthSignupRequest;
use App\Http\Requests\AuthVerifyRequest;
use App\Models\Customer;
use App\Services\SmsService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;

class AuthController extends Controller
{
    public function signup(AuthSignupRequest $request, SmsService $smsService)
    {
        $customer = Customer::firstOrCreate(
            ['phone' => $request->phone],
            ['name' => $request->name, 'email' => $request->email]
        );

        $code = rand(10000, 99999);
        Cache::put("verification_code:{$customer->phone}", $code, now()->addMinutes(15));

        $smsService->sendSms($customer->phone, "Your CloudiFi verification code is: {$code}");

        return Response::json(['message' => 'Verification code sent.']);
    }

    public function verify(AuthVerifyRequest $request)
    {
        $code = Cache::get("verification_code:{$request->phone}");
        if (! $code || (string) $code !== (string) $request->code) {
            return Response::json(['error' => 'Invalid or expired code.'], 400);
        }

        $customer = Customer::where('phone', $request->phone)->first();
        if (! $customer) {
            return Response::json(['error' => 'Customer not found.'], 404);
        }

        $customer->update(['email' => $request->email]);
        Cache::forget("verification_code:{$customer->phone}");

        return Response::json(['message' => 'Email verified.']);
    }

    public function resend(AuthSignupRequest $request, SmsService $smsService)
    {
        $customer = Customer::firstOrCreate(
            ['phone' => $request->phone],
            ['name' => $request->name, 'email' => $request->email]
        );

        $code = rand(10000, 99999);
        Cache::put("verification_code:{$customer->phone}", $code, now()->addMinutes(15));

        $smsService->sendSms($customer->phone, "Your CloudiFi verification code is: {$code}");

        return Response::json(['message' => 'Verification code resent.']);
    }
}
