<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaigns extends Model
{
    protected $fillable = [
        'title',
        'slug_translation_key_id',
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

    public function translationKey()
    {
        return $this->belongsTo(TranslationKey::class, 'slug_translation_key_id', 'id');
    }

}
