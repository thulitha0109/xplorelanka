<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'booking_id',
        'provider',
        'provider_checkout_id',
        'provider_transaction_id',
        'idempotency_key',
        'amount_minor',
        'currency',
        'status',
        'metadata',
        'paid_at',
    ];

    protected $casts = [
        'amount_minor' => 'integer',
        'metadata' => 'array',
        'paid_at' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
