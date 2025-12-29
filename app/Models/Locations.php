<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Locations extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'parent_id',
        'city',
        'address',
        'email',
        'phone',
        'latitude',
        'longitude',
        'is_active'
    ];


    public function parent()
    {
        return $this->belongsTo(Locations::class, 'parent_id');
    }
    public function cars()
    {
        return $this->hasMany(Car::class);
    }

    /*public function reservations()
    {
        return $this->hasMany(Reservation::class);
     }*/
}
