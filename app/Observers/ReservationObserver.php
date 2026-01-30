<?php

namespace App\Observers;

use App\Models\Reservation;
use Illuminate\Support\Str;

class ReservationObserver
{
    public function creating(Reservation $reservation): void
    {
        $reservation->reference_code = $this->generateUniqueCode();
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = 'RAC-' . strtoupper(Str::random(6));
        } while (Reservation::where('reference_code', $code)->exists());

        return $code;
    }
}