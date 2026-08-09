<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // No explicit routes to register here.
    }

    public function boot(): void
    {
        Route::prefix('api')
            ->group(base_path('routes/api.php'));
    }
}
