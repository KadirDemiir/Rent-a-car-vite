<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationExtra extends Model
{
    protected $fillable = [
        'reservation_id',
        'extra_service_id',
        'price',
        'quantity',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
