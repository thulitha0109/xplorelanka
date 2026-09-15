<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'partner_type',
        'location',
        'vehicle_or_property_details',
        'rate_lkr',
        'rating',
        'message',
        'status',
    ];

    protected $casts = [
        'rate_lkr' => 'decimal:2',
        'rating' => 'decimal:2',
    ];
}
