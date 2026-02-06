<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Reservation extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'reference_code',
        'token',
        'car_id',
        'user_id',
        'name',
        'surname',
        'identity_number',
        'phone_number',
        'pickup_location_id',
        'return_location_id',
        'pickup_datetime',
        'return_datetime',
        'rental_days',
        'daily_price',
        'drop_price',
        'extras_total',
        'discount_amount',
        'discount_type',
        'discount_target',
        'total_price',
        'currency_id',
        'exchange_rate',
        'email',
        'address',
        'birthday',
        'arrival_flight_no',
        'return_flight_no',
        'payment_type',
        'notes',
        'payment_status',
        'status',
    ];

    protected $casts = [
        'pickup_datetime' => 'datetime',
        'return_datetime' => 'datetime',
        'birthday' => 'date',
        'discount_amount' => 'decimal:2',
        'total_price' => 'decimal:2',
        'daily_price' => 'decimal:2',
    ];

    protected $appends = ['tracking_url'];
    
    protected static function booted()
    {
        static::creating(function ($reservation) {
            $reservation->token = (string) Str::uuid();
        });
    }

    protected function trackingUrl(): Attribute
    {
        return Attribute::get(function () {
            if (!$this->token) {
                return null;
            }

            return route('reservation.track', [
                'token' => $this->token
            ]);
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function car()
    {
        return $this->belongsTo(Car::class)
            ->with(['brandKey:id,key', 'modelKey:id,key']);
    }

    public function extras()
    {
        return $this->hasMany(ReservationExtra::class)->with('extra:id,name,description');
    }

    public function reservation_extras()
    {
        return $this->hasMany(ReservationExtra::class);
    }

    public function pickupLocation()
    {
        return $this->belongsTo(Locations::class, 'pickup_location_id');
    }

    public function returnLocation()
    {
        return $this->belongsTo(Locations::class, 'return_location_id');
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }

    public function scopeReadyForPickup($query)
    {
        return $query->whereDate('pickup_datetime', '<=', Carbon::tomorrow())
            ->where('status', 'confirmed');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', 'confirmed')
            ->where(function ($q) {
                $q->where('pickup_datetime', '>=', now())
                  ->orWhereDate('return_datetime', '>=', now());
            });
    }

    public function scopeActiveRentals($query)
    {
        return $query->where('status', 'active')->whereDate('return_datetime', '>=', now());
    }

    public function scopeLateReturns($query)
    {
        return $query->whereDate('return_datetime', '<', now())
            ->where('status', 'active');
    }
}