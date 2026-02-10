<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CarGroup extends Model
{

    protected $fillable = [
        'name',
        'segment_id',
        'cover_image',
        'deposit',
        'features',
        'transmission_id',
        'fuel_id',
        'currency_id',
        'body_type_id',
        'seat_count',
        'trunk_capacity',
        'sort_order',
    ];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
    protected $casts = [
        'features' => 'array',
    ];

    public function cars(): HasMany
    {
        return $this->hasMany(Car::class, 'car_group_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'car_group_id')
            ->with([
                'extras',
                'pickupLocation:id,name',
                'returnLocation:id,name',
                'currency:id,code,symbol',
                'carGroup:id,segment_id,fuel_id,transmission_id',
            ]);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class, 'car_group_id');
    }

    public function discount(): HasMany
    {
        return $this->hasMany(Discount::class, 'car_group_id');
    }

    public function bodyType()
    {
        return $this->belongsTo(BodyType::class);
    }

    public function fuel()
    {
        return $this->belongsTo(Fuel::class, 'fuel_id');
    }

    public function transmission()
    {
        return $this->belongsTo(Transmission::class, 'transmission_id');
    }



    public function price(): HasMany
    {
        return $this->hasMany(Price::class, 'car_group_id');
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class, 'currency_id');
    }

    public function segment()
    {
        return $this->belongsTo(Segment::class, 'segment_id');
    }
}
