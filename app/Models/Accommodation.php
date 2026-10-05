<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Accommodation extends Model
{
    use HasFactory;
    use Concerns\HasCatalogPrices;
    use Concerns\HasMediaCleanup;

    protected array $mediaFields = ['image', 'gallery'];

    protected $fillable = [
        'partner_id',
        'name',
        'category',
        'location',
        'latitude',
        'longitude',
        'price_lkr',
        'period',
        'rating',
        'reviews_count',
        'image',
        'gallery',
        'amenities',
        'room_types',
        'description',
        'contact_phone',
        'contact_email',
        'is_available',
        'is_featured',
    ];

    protected $casts = [
        'amenities'   => 'array',
        'gallery'     => 'array',
        'room_types'  => 'array',
        'price_lkr'   => 'decimal:2',
        'rating'      => 'decimal:2',
        'latitude'    => 'decimal:7',
        'longitude'   => 'decimal:7',
        'is_available'=> 'boolean',
        'is_featured' => 'boolean',
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
