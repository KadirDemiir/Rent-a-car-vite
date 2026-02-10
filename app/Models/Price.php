<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected $fillable = [
        'car_group_id',
        'month',
        'min_days',
        'max_days',
        'currency_id',
        'price',
        'base_price',
        'is_active',
    ];

    public function carGroup()
    {
        return $this->belongsTo(CarGroup::class, 'car_group_id');
    }

    protected static function booted()
    {
        static::saving(function ($price) {
            if ($price->is_active) {
                $exists = static::where('car_group_id', $price->car_group_id)
                    ->where('month', $price->month)
                    ->where('min_days', $price->min_days)
                    ->where('max_days', $price->max_days)
                    ->where('is_active', true)
                    ->where('id', '!=', $price->id)
                    ->exists();

                if ($exists) {
                    throw new \Exception('Bu kombinasyon için zaten aktif bir fiyat kaydı mevcut.');
                }
            }
        });
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }
}
