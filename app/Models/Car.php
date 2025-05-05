<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    protected $fillable = [
        'location_id',
        'brand',
        'model',
        'year',
        'segment',
        'body_type',
        'seat_count',
        'trunk_capacity',
        'fuel_type',
        'transmission_type',
        'license_plate'
    ];

    public function reservations() {
        return $this->hasMany(Reservation::class);
    }

    public function locations()
    {
        return $this->belongsTo(Locations::class, 'location_id');
    }
    
}
