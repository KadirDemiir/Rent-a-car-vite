<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    /** @use HasFactory<\Database\Factories\ReservationFactory> */
    use HasFactory;

    protected $fillable = [
        'car_id',
        'name',
        'surname',
        'tc_number',
        'phone_number',
        'pickup_location',
        'return_location',
        'pickup_datetime',
        'return_datetime',
        'rental_days',
        'daily_price',
        'extras_total',
        'total_price',
        'payment_type',
        'payment_status',
        'status',
    ];

    protected $casts = [
        'pickup_datetime' => 'datetime',
        'return_datetime' => 'datetime',
    ];

    // İlişkiler
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function extras()
    {
        return $this->hasMany(ReservationExtra::class);
    }
}
