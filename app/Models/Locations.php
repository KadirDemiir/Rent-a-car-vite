<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Locations extends Model
{
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
}
