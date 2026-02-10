<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BodyType extends Model
{
    protected $fillable = [
        'translation_key_id',
        'is_active'
    ];

    public function translationKey(){
        return $this->belongsTo(TranslationKey::class, 'translation_key_id');
    }

    public function carGroups()
    {
        return $this->hasMany(CarGroup::class, 'body_type_id');
    }
}
