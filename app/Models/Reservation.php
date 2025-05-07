<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    /** @use HasFactory<\Database\Factories\ReservationFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'car_id',
        'pickup_location',
        'return_location',
        'picup_dateTime',
        'return_dateTime',
        'price',
        'status',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function car() {
        return $this->belongsTo(Car::class, 'car_id');
    }
    
    
}
