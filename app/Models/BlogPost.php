<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasFactory;
    use Concerns\HasMediaCleanup;

    protected array $mediaFields = ['image'];

    protected $fillable = [
        'title',
        'slug',
        'category',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        'image',
        'excerpt',
        'content',
        'author',
        'published_at',
        'is_published',
        'views_count',
        'reading_time_min',
        'tags',
    ];

    protected $casts = [
        'published_at'     => 'datetime',
        'is_published'     => 'boolean',
        'views_count'      => 'integer',
        'reading_time_min' => 'integer',
        'tags'             => 'array',
    ];
}
