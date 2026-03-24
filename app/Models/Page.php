<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'title',
        'route_group_name',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'sort_order',
        'is_system',
        'is_active',
    ];

    protected $casts = [
        'title' => 'array',
        'meta_title' => 'array',
        'meta_description' => 'array',
        'meta_keywords' => 'array',
        'is_active' => 'boolean',
        'is_system' => 'boolean',
    ];
}
