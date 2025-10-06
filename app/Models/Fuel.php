<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fuel extends Model
{
    protected $fillable = ['translation_key_id', 'is_active'];

    public function translationKey(){
        return $this->belongsTo(TranslationKey::class);
    }
}
