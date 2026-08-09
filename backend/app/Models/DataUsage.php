<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataUsage extends Model
{
    protected $table = 'data_usage';

    protected $fillable = [
        'customer_id',
        'router_id',
        'bytes_up',
        'bytes_down',
        'online',
        'last_update',
    ];

    protected $casts = [
        'online' => 'boolean',
        'last_update' => 'datetime',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function router(): BelongsTo
    {
        return $this->belongsTo(Router::class);
    }
}
