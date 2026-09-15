<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_key',
        'name',
        'seats',
        'rate_per_km',
        'base_rate_lkr',
        'icon',
        'image',
        'description',
        'driver_included',
        'ac_available',
        'is_available',
    ];

    protected $casts = [
        'base_rate_lkr' => 'decimal:2',
        'driver_included' => 'boolean',
        'ac_available' => 'boolean',
        'is_available' => 'boolean',
    ];
}
