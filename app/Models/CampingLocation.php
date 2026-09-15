<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampingLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'location',
        'image',
        'types',
        'inclusions',
        'durations',
        'add_ons',
        'description',
        'starting_price_lkr',
        'is_active',
    ];

    protected $casts = [
        'types' => 'array',
        'inclusions' => 'array',
        'durations' => 'array',
        'add_ons' => 'array',
        'starting_price_lkr' => 'decimal:2',
        'is_active' => 'boolean',
    ];
}
