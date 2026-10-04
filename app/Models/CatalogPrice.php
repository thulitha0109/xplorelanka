<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class CatalogPrice extends Model
{
    protected $fillable = [
        'unit',
        'currency',
        'amount_minor',
        'source_currency',
        'source_amount',
        'exchange_rate',
        'is_active',
    ];

    protected $casts = [
        'amount_minor' => 'integer',
        'source_amount' => 'decimal:4',
        'exchange_rate' => 'decimal:8',
        'is_active' => 'boolean',
    ];

    public function priceable(): MorphTo
    {
        return $this->morphTo();
    }
}
