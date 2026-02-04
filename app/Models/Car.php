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

    /**
     * Relationships to eager load by default to prevent N+1 queries
     */
    //protected $with = ['brandKey', 'modelKey', 'location', 'bodyType', 'segment', 'currency', 'fuel', 'transmission'];

    protected $fillable = [
        'location_id',
        'current_location_id',
        'brand_translation_key_id',
        'model_translation_key_id',
        'year',
        'segment_id',
        'body_type_id',
        'seat_count',
        'currency_id',
        'deposit',
        'trunk_capacity',
        'fuel_id',
        'transmission_id',
        'status',
        'license_plate',
        'sort_order'
    ];

    public function reservations() {
        return $this->hasMany(Reservation::class, 'car_id')->with(['extras', 'pickupLocation', 'returnLocation']);
    }

    public function location()
    {
        return $this->belongsTo(Locations::class);
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

    public function fuel()
    {
        return $this->belongsTo(Fuel::class, 'fuel_id');
    }

    public function transmission()
    {
        return $this->belongsTo(Transmission::class, 'transmission_id');
    }

    public function brandKey()
    {
        return $this->belongsTo(TranslationKey::class, 'brand_translation_key_id');
    }

    public function modelKey()
    {
        return $this->belongsTo(TranslationKey::class, 'model_translation_key_id');
    }

    public function price() {
        return $this->hasMany(Price::class, 'car_id');
    }

    public function currency(){
        return $this->belongsTo(Currency::class, 'currency_id');
    }

    public function segment(){
        return $this->belongsTo(Segment::class, 'segment_id');
    }
}
