<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Locations extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'city',
        'address',
        'phone'
    ];

    public function cars()
    {
        return $this->hasMany(Car::class);
    }

    /*public function reservations()
    {
        return $this->hasMany(Reservation::class);
     }*/
}
