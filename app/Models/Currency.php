<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected $fillable = ['code', 'symbol', 'exchange_rate', 'is_default', 'is_active'];

    protected static function booted()
    {
        static::saving(function ($model) {
            if ($model->is_default) {
                static::where('id', '!=', $model->id)->update(['is_default' => false]);
            }
        });
    }

    protected $casts = [
        'exchange_rate' => 'decimal:8',
    ];

    public function prices(){
        return $this->hasMany(Price::class);
    }

    public function carGroups()
    {
        return $this->hasMany(CarGroup::class);
    }


}
