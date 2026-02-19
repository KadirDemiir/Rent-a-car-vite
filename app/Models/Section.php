<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Section extends Model
{

    protected $fillable = [
        'page_id',
        'title',
        'content',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'title' => 'array',
        'content' => 'array',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}
