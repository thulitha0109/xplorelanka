<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'user_id',
        'customer_name',
        'customer_country',
        'title',
        'rating',
        'comment',
        'media_urls',
        'is_approved',
    ];

    protected $casts = [
        'media_urls'  => 'array',
        'is_approved' => 'boolean',
        'rating'      => 'integer',
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
