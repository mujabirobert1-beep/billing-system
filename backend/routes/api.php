<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CallbackController;
use App\Http\Controllers\DataUsageController;
use App\Http\Controllers\HeartbeatController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ResellerController;
use Illuminate\Support\Facades\Route;

Route::post('/payment/initiate', [PaymentController::class, 'initiate']);
Route::post('/mtn/callback', [CallbackController::class, 'handle']);
Route::post('/router/heartbeat', [HeartbeatController::class, 'handle']);
Route::post('/router/check', [HeartbeatController::class, 'checkStatus']);
Route::post('/data-usage', [DataUsageController::class, 'record']);
Route::post('/auth/signup', [AuthController::class, 'signup']);
Route::post('/auth/verify', [AuthController::class, 'verify']);
Route::post('/auth/resend', [AuthController::class, 'resend']);
Route::get('/reseller/dashboard', [ResellerController::class, 'dashboard']);
