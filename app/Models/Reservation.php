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
        'notes',
        'payment_status',
        'status',
    ];

    protected $casts = [
        'pickup_datetime' => 'datetime',
        'return_datetime' => 'datetime',
        'birthday' => 'date'
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
        return $this->hasMany(ReservationExtra::class)->with('extra');
    }

    public function reservation_extras()
    {
        return $this->hasMany(ReservationExtra::class);
    }

    public function pickupLocation()
    {
        return $this->belongsTo(Locations::class, 'pickup_location_id');
    }

    public function returnLocation()
    {
        return $this->belongsTo(Locations::class, 'return_location_id');
    }
}
