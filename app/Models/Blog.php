<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = [
        'title',
        'slug_translation_key_id',
        'content',
        'cover_photo_path',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'title' => 'array',
        'content' => 'array',
        'meta_title' => 'array',
        'meta_description' => 'array',
        'meta_keywords' => 'array',
        'created_at' => 'datetime',
    ];

    public function translationKey()
    {
        return $this->belongsTo(TranslationKey::class, 'slug_translation_key_id', 'id');
    }
}
