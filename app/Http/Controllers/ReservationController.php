<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\DropPrice;
use App\Models\Locations;
use App\Models\Price;
use App\Models\Reservation;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function searchReservations(Request $request)
    {
        if (!$request->has(['startDateTime', 'finishDateTime', 'PULocation', 'RLocation'])) {
            return Inertia::render('SearchReservations', ['availableCars' => []]);
        }

        $request->validate([
            'startDateTime' => 'required|date',
            'finishDateTime' => 'required|date|after:startDateTime',
            'PULocation' => 'required|exists:locations,id',
            'RLocation' => 'required|exists:locations,id',
        ]);

        if($request->startDateTime >= $request->finishDateTime || $request->startDateTime < Carbon::now() || $request->finishDateTime < Carbon::now())
        {
            Log::info(3);
            return to_route('home');
        }

        $cars = Car::with('location', 'photos', 'brandKey', 'modelKey', 'price')->get();
        $availableCars = [];

        $reqStart = Carbon::parse($request->startDateTime);
        $reqEnd = Carbon::parse($request->finishDateTime);

        foreach ($cars as $car) {
            $isAvailable = true;
            $eachReservations = Reservation::where('car_id', $car->id)->get();

            foreach($eachReservations as $eachRes){
                $resStart = Carbon::parse($eachRes->pickup_dateTime);
                $resEnd = Carbon::parse($eachRes->return_dateTime);

                if ($resStart < $reqEnd && $resEnd > $reqStart) {
                    $isAvailable = false;
                    break;
                }
            }

            if($isAvailable && ($request->PULocation == $car->location->id)) {
                $this->CalcPrice($car, $request->startDateTime, $request->finishDateTime, $request->PULocation, $request->RLocation);

                if($car->daily_price !== null) {
                    $availableCars[] = $car;
                }
            }
        }

        return Inertia::render('SearchReservations', [
            'availableCars' => $availableCars,
            'reservation' => [
                'startDate' => $reqStart->toDateString(),
                'startTime' => $reqStart->format('H:i'),
                'finishDate' => $reqEnd->toDateString(),
                'finishTime' => $reqEnd->format('H:i'),
                'selectedPULocation' => Locations::where('id', $request->PULocation)->first(),
                'selectedRLocation' => Locations::where('id', $request->RLocation)->first(),
            ],
            'locations' => Locations::all()
        ]);
    }

    public function showDetailPage(Request $request){
        $request->validate([
            'car_id' => 'required|exists:cars,id',
            'startDateTime' => 'required|date',
            'finishDateTime' => 'required|date|after:startDateTime',
            'PULocation' => 'required|exists:locations,id',
            'RLocation' => 'required|exists:locations,id',
        ]);

        $car = Car::with('brandKey', 'modelKey', 'photos', 'location')->findOrFail($request->car_id);

        $start = Carbon::parse($request->startDateTime);
        $end = Carbon::parse($request->finishDateTime);

        $conflict = false;
        $eachReservations = Reservation::where('car_id', $car->id)->get();

        foreach($eachReservations as $eachRes){
            $resStart = Carbon::parse($eachRes->pickup_dateTime);
            $resEnd = Carbon::parse($eachRes->return_dateTime);

            if ($resStart < $end && $resEnd > $start) {
                $conflict = true;
                break;
            }
        }
        if($start >= $end || $start < Carbon::now() || $end < Carbon::now())
        {
            return Inertia::render('Home');
        }

        if($conflict) {
            return Inertia::render('Home');
        }

        $this->CalcPrice($car, $request->startDateTime, $request->finishDateTime, $request->PULocation, $request->RLocation);

        return Inertia::render('SelectExtras', [
            'car' => $car,
            'params' => $request->all()
        ]);
    }

    public function CalcPrice($car, $startDateTime, $finishDateTime, $puLocationId, $rLocationId){
        $start = new DateTime($startDateTime);
        $finish = new DateTime($finishDateTime);

        $month = $start->format('m');

        $diff = $start->diff($finish);
        $dayCount = $diff->days;

        if ($diff->h > 3)
            $dayCount += 1;

        if ($dayCount == 0) $dayCount = 1;

        $car->total_days = $dayCount;

        $drop = DropPrice::select('price', 'currency')
            ->where('from_location_id', $puLocationId)
            ->where('to_location_id', $rLocationId)
            ->first();

        $dailyPrice = Price::select('price', 'currency_id', 'min_days', 'max_days')
            ->where('car_id', $car->id)
            ->where('is_active', 1)
            ->where('month', (int)$month)
            ->orderByDesc('min_days')
            ->with('currency')
            ->get()
            ->first(function ($price) use ($dayCount) {
                return $dayCount >= $price->min_days && $dayCount <= $price->max_days;
            });

        if($dailyPrice) {
            $car->daily_price = $dailyPrice->price;
            $car->daily_price_currency = $dailyPrice->currency;
        } else {
            $car->daily_price = null;
            $car->daily_price_currency = null;
        }

        if ($drop) {
            $car->drop_price = $drop->price;
            $car->drop_currency = $drop->currency;
        } else {
            $car->drop_price = null;
            $car->drop_currency = null;
        }
    }
}
