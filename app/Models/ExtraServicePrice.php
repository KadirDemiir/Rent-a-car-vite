<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExtraServicePrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'extra_service_id',
        'min_days',
        'max_days',
        'price',
        'currency_id'
    ];

    public function extraService()
    {
        return $this->belongsTo(ExtraServices::class, 'extra_service_id');
    }
}
