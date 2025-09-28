<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExtraServices extends Model
{
    protected $fillable = [
        'name',
        'one_three_day_price',
        'four_seven_day_price',
        'eight_fifteen_day_price',
        'more_than_fifteen_day_price',
        'currency',
        'stock',
        'max_limit',
        'description',
    ];
}
