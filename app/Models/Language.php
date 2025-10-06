<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Language extends Model
{
    protected $fillable = [
        'name',
        'code',
        'flag_photo_path',
        'status'
    ];

    public function translations(): HasMany{
        return $this->hasMany(Translation::class);
    }
}
