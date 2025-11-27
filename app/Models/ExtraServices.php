<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExtraServices extends Model
{
    protected $fillable = [
        'name',
        'stock',
        'max_limit',
        'description',
    ];

    protected $casts = [
        'name' => 'array', // veya 'json'
        'description' => 'array'
    ];
}
