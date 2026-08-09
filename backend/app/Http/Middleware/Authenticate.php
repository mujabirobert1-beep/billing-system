<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class Authenticate
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->header('X-API-KEY') !== env('API_KEY')) {
            return Response::json(['error' => 'Unauthorized.'], 401);
        }

        return $next($request);
    }
}
