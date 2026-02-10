<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    use HasFactory;

    protected $fillable = [
        'car_group_id',
        'photo_path',
        'is_cover',
    ];

    public function carGroup(): BelongsTo
    {
        return $this->belongsTo(CarGroup::class, 'car_group_id');
    }
}
