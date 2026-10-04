<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_no',
        'type',
        'customer_name',
        'customer_email',
        'customer_phone',
        'country',
        'country_code',
        'tour_id',
        'pickup_location',
        'dropoff_location',
        'start_date',
        'end_date',
        'guests_count',
        'vehicle_type',
        'total_price',
        'currency',
        'quoted_total_minor',
        'price_snapshot',
        'payment_status',
        'status',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_price' => 'decimal:2',
        'quoted_total_minor' => 'integer',
        'price_snapshot' => 'array',
    ];

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
