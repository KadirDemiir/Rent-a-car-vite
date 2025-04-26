<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    protected $fillable = [
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
}
