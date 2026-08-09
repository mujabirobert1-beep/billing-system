<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('routers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained('sites')->cascadeOnDelete();
            $table->string('name');
            $table->string('ip')->nullable();
            $table->string('api_user')->nullable();
            $table->string('api_pass')->nullable();
            $table->string('status')->default('offline');
            $table->timestamp('last_seen')->nullable();
            $table->decimal('cpu', 5, 2)->nullable();
            $table->decimal('ram', 5, 2)->nullable();
            $table->integer('uptime')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routers');
    }
};
