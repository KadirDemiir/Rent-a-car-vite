<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DropPrice extends Model
{
    protected $fillable = [
        'from_location_id',
        'to_location_id',
        'currency',
        'price'
    ];
}
