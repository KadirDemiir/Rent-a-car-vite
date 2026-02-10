<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Discount extends Model
{
    protected $fillable = [
        'discount_type',
        'discount_value',
        'target_type',
        'currency_id',
        'car_group_id',
        'campaign_id',
        'min_days',
        'max_days',
        'segment_id',
        'start_date',
        'end_date',
        'status',
    ];

    public function scopeActive($query)
    {
        return $query
            ->where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }

    public function carGroup(): BelongsTo
    {
        return $this->belongsTo(CarGroup::class, 'car_group_id');
    }

    public function campaigns(): BelongsTo{
        return $this->belongsTo(Campaigns::class);
    }



}
