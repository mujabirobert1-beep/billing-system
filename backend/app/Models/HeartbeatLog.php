<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HeartbeatLog extends Model
{
    protected $fillable = [
        'router_id',
        'status',
        'cpu',
        'ram',
    ];

    public function router(): BelongsTo
    {
        return $this->belongsTo(Router::class);
    }
}
