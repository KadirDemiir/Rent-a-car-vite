<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_id',
        'user_id',
        'name',
        'surname',
        'tc_number',
        'phone_number',
        'pickup_location_id',
        'return_location_id',
        'pickup_datetime',
        'return_datetime',
        'rental_days',
        'daily_price',
        'drop_price',
        'extras_total',
        'discount_amount',
        'discount_type',
        'discount_target',
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
        'birthday' => 'date',
        'discount_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function car()
    {
        return $this->belongsTo(Car::class)->with('brandKey', 'modelKey');
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

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }
}
