<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Partner extends Model
{
    use HasFactory;
    use Concerns\HasCatalogPrices;

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
        'rating'   => 'decimal:2',
    ];

    public function accommodations(): HasMany
    {
        return $this->hasMany(Accommodation::class);
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }
}
