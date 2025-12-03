<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExtraServices extends Model
{
    protected $fillable = [
        'name',
        'stock',
        'max_limit',
        'current_stock',
        'type',
        'description',
    ];

    protected $casts = [
        'name' => 'json', // veya 'json'
        'description' => 'json'
    ];

    public function extraServicePrices(){
        return $this->hasMany(ExtraServicePrice::class, 'extra_service_id');
    }
}
