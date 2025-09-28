<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method static where(string $string, $id)
 */
class Car extends Model
{
    /** @use HasFactory<\Database\Factories\CarFactory> */
    use HasFactory;

    protected static function newFactory(): \Database\Factories\CarFactory
    {
        return \Database\Factories\CarFactory::new();
    }


    protected $fillable = [
        'location_id',
        'brand',
        'model',
        'year',
        'segment',
        'body_type_id',
        'seat_count',
        'price',
        'price_currency',
        'deposit_currency',
        'deposit',
        'trunk_capacity',
        'fuel_type',
        'transmission_type',
        'license_plate'
    ];


    public function reservation() {
        return $this->hasMany(Reservation::class);
    }

    public function location()
    {
        return $this->belongsTo(Locations::class, 'location_id');
    }
    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class);
    }
    public function discount(): HasMany{
        return $this->hasMany(Discount::class);
    }

    public function bodyType()
    {
        return $this->belongsTo(BodyType::class);
    }


}
