<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationExtra extends Model
{
    protected $fillable = [
        'reservation_id',
        'extra_name',
        'extra_price',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
