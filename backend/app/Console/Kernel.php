<?php

namespace App\Console;

use App\Jobs\CheckRouterStatus;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        $schedule->job(new CheckRouterStatus())->everyMinute();
    }

    protected function commands(): void
    {
        require __DIR__.'/../../routes/console.php';
    }
}
