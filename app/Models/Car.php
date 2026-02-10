<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_group_id',
        'current_location_id',
        'location_id',
        'brand_translation_key_id',
        'model_translation_key_id',
        'plate_number',
        'exact_year',
        'chassis_number',
        'current_km',
        'status',
    ];

    protected $casts = [
        'exact_year' => 'integer',
        'current_km' => 'integer',
        'current_location_id' => 'integer',
        'location_id' => 'integer',
        'car_group_id' => 'integer',
    ];

    public function carGroup(): BelongsTo
    {
        return $this->belongsTo(CarGroup::class);
    }

    public function currentLocation(): BelongsTo
    {
        return $this->belongsTo(Locations::class, 'current_location_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Locations::class, 'location_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'assigned_vehicle_id');
    }

    public function brandKey()
    {
        return $this->belongsTo(TranslationKey::class, 'brand_translation_key_id');
    }

    public function modelKey()
    {
        return $this->belongsTo(TranslationKey::class, 'model_translation_key_id');
    }
}
