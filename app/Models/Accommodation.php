<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accommodation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'location',
        'price_lkr',
        'period',
        'rating',
        'reviews_count',
        'image',
        'amenities',
        'description',
        'is_available',
    ];

    protected $casts = [
        'amenities' => 'array',
        'price_lkr' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_available' => 'boolean',
    ];
}
