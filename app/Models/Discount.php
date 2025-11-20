<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Discount extends Model
{
    protected $fillable=[
        "discount_type",
        "discount_value",
        "target_type",
        "currency",
        "car_id",
        "campaign_id",
        "min_days",
        "max_days",
        "segment_id ",
        "start_date",
        "end_date",
        "status",
    ];

    public function car(): BelongsTo{
        return $this->belongsTo(Car::class);
    }

    public function campaigns(): BelongsTo{
        return $this->belongsTo(Campaigns::class);
    }

}
