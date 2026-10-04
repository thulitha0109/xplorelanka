<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory;
    use Concerns\HasCatalogPrices;

    protected $fillable = [
        'partner_id',
        'vehicle_key',
        'vehicle_category',
        'name',
        'seats',
        'luggage_capacity',
        'transmission',
        'fuel_type',
        'rate_per_km',
        'base_rate_lkr',
        'daily_rate_lkr',
        'pricing_tiers',
        'icon',
        'image',
        'gallery',
        'description',
        'driver_included',
        'ac_available',
        'is_available',
        'fleet_count',
    ];

    protected $casts = [
        'base_rate_lkr'  => 'decimal:2',
        'daily_rate_lkr' => 'decimal:2',
        'pricing_tiers'  => 'array',
        'gallery'        => 'array',
        'driver_included'=> 'boolean',
        'ac_available'   => 'boolean',
        'is_available'   => 'boolean',
        'luggage_capacity'=> 'integer',
        'fleet_count'    => 'integer',
    ];

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
