<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaigns extends Model
{
    protected $fillable = [
        'title',
        'photo_path',
        'content',
        'start_date',
        'end_date',
        'status'
    ];

    protected $casts = [
        'title' => 'array',
        'content' => 'array',
    ];

    public function discounts()
    {
        return $this->hasMany(Discount::class, 'campaign_id');
    }

}
