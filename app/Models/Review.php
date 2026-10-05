<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;
    use Concerns\HasMediaCleanup;

    protected array $mediaFields = ['media_urls'];

    protected $fillable = [
        'tour_id',
        'accommodation_id',
        'vehicle_id',
        'user_id',
        'customer_name',
        'customer_country',
        'title',
        'rating',
        'comment',
        'media_urls',
        'is_approved',
        'source_platform',
    ];

    protected $casts = [
        'media_urls'  => 'array',
        'is_approved' => 'boolean',
        'rating'      => 'integer',
    ];

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function accommodation(): BelongsTo
    {
        return $this->belongsTo(Accommodation::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
