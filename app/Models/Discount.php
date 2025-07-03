<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Discount extends Model
{
    protected $fillable=[
        "discount_type",
        "discount_value",
        "target_type",
        "car_id",
        "segment_name",
        "start_date",
        "end_date",
        "status",
    ];

    public function car(){
        return $this->belongsTo(Car::class);
    }
}
