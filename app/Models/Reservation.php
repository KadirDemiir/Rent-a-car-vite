<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'name',
        'surname',
        'tc_number',
        'phone_number',
        'pickup_location_id',
        'return_location_id',
        'pickup_datetime',
        'drop_price',
        'return_datetime',
        'rental_days',
        'daily_price',
        'extras_total',
        'total_price',
        'currency_id',
        'email',
        'address',
        'birthday',
        'arrival_flight_no',
        'return_flight_no',
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
