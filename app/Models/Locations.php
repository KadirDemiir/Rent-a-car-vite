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
        'photo_path',
        'longitude',
        'is_active'
    ];


    protected $casts = [
        'latitude' => 'double',
        'longitude' => 'double',
        'isActive' => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(Locations::class, 'parent_id');
    }
    public function cars()
    {
        return $this->hasMany(Car::class, 'location_id');
    }

    /*public function reservations()
    {
        return $this->hasMany(Reservation::class);
     }*/
}
