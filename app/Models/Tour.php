<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'route',
        'duration',
        'price_lkr',
        'price_usd',
        'description',
        'highlights',
        'itinerary',
        'image',
        'gallery',
        'tags',
        'waypoints',
        'video_url',
        'map_center_lat',
        'map_center_lng',
        'seo_title',
        'seo_description',
        'max_group_size',
        'difficulty',
        'rating',
        'reviews_count',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'highlights'     => 'array',
        'itinerary'      => 'array',
        'gallery'        => 'array',
        'tags'           => 'array',
        'waypoints'      => 'array',
        'price_lkr'      => 'decimal:2',
        'price_usd'      => 'decimal:2',
        'rating'         => 'decimal:2',
        'map_center_lat' => 'decimal:7',
        'map_center_lng' => 'decimal:7',
        'is_featured'    => 'boolean',
        'is_active'      => 'boolean',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
