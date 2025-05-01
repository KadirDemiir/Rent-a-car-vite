<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaigns extends Model
{
    protected $fillable = [
        'title',
        'photo_path',
        'content'
    ];
}
