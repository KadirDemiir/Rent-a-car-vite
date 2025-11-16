<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Currency;
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
        /*Log::info('coming reservation request', ['request => ', $request->all()]);*/
        if (!$request->has(['startDateTime', 'finishDateTime', 'PULocation', 'RLocation'])) {
            return Inertia::render('SearchReservations', ['availableCars' => []]);
        }

        $request->validate([
            'startDateTime' => 'required|date',
            'finishDateTime' => 'required|date|after:startDate',
            'PULocation' => 'required|exists:locations,id',
            'RLocation' => 'required|exists:locations,id',
        ]);
        $cars = Car::with('location', 'photos', 'brandKey', 'modelKey', 'price')->get();
        $availableCars = [];

        foreach ($cars as $car) {
            $a = true;
            $eachReservations = Reservation::where('car_id', $car->id)->get();
            foreach($eachReservations as $eachRes){
                if(($eachRes->pickup_dateTime > $request->finishDateTime) || ($eachRes->return_dateTime < $request->startDateTime))
                    $a = false;
            }
            if($a && ($request->PULocation == $car->location->id)) {
                $month = explode("-", explode(" ", $request->finishDateTime)[0])[1];

                $start = new DateTime($request->startDateTime);
                $finish = new DateTime($request->finishDateTime);
                $diff = $start->diff($finish);
                $dayCount = $diff->days;
                if ($diff->h > 3)
                    $dayCount += 1;
                $car->total_days = $dayCount;
                $drop = DropPrice::select('price', 'currency')->where('from_location_id', $request->PULocation)->where('to_location_id', $request->RLocation)->first();
                $dailyPrice = Price::select('price', 'currency_id', 'min_days', 'max_days')->where('car_id', $car->id)->where('is_active', 1)->where('month', $month)->orderByDesc('min_days')->with('currency')->get()->first(function ($price) use ($dayCount) {
                        return $dayCount >= $price->min_days && $dayCount <= $price->max_days;
                    });
                if($dailyPrice) {
                    $car->daily_price = $dailyPrice->price;
                    $car->daily_price_currency = $dailyPrice->currency;
                }
                else{
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
                $availableCars[] = $car;

            }
        }

        /*Log::info('coming reservation request', ['request22 => ', $request->all()]);*/
        return Inertia::render('SearchReservations', [
            'availableCars' => $availableCars,
            'reservation' => [
                'startDate' => Carbon::parse($request->startDateTime)->toDateString(),
                'startTime' => Carbon::parse($request->startDateTime)->format('H:i'),
                'finishDate' => Carbon::parse($request->finishDateTime)->toDateString(),
                'finishTime' => Carbon::parse($request->finishDateTime)->format('H:i'),
                'selectedPULocation' => Locations::where('id', $request->PULocation)->first(),
                'selectedRLocation' => Locations::where('id', $request->RLocation)->first(),
            ],
            'locations' => Locations::all()
        ]);
    }

}
