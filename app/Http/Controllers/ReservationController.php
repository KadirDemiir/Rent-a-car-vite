<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function searchReservations(Request $request)
    {
        if (!$request->has(['startDateTime', 'finishDateTime', 'selectedPULocation', 'selectedRLocation'])) {
            return Inertia::render('SearchReservations', ['availableCars' => []]);
        }

        $request->validate([
            'startDateTime' => 'required|date',
            'finishDateTime' => 'required|date|after:startDate',
            'selectedPULocation' => 'required|string',
            'selectedRLocation' => 'required|string',
        ]);
        $cars = Car::with('location', 'photos')->get();
        $availableCars = [];

        foreach ($cars as $car) {
            $a = true;
            $eachReservations = Reservation::where('car_id', $car->id)->get();
            foreach($eachReservations as $eachRes){
                if(
                    ($eachRes->pickup_dateTime > $request->finishDateTime) ||
                    ($eachRes->return_dateTime < $request->startDateTime)
                )
                    $a = false;
            }
            if($a && ($request->selectedPULocation == $car->location->city))
                $availableCars [] = $car;
        }

        return Inertia::render('SearchReservations', [
            'availableCars' => $availableCars,
            'reservation' => [
                'startDate' => Carbon::parse($request->startDateTime)->toDateString(),
                'startTime' => Carbon::parse($request->startDateTime)->format('H:i'),
                'finishDate' => Carbon::parse($request->finishDateTime)->toDateString(),
                'finishTime' => Carbon::parse($request->finishDateTime)->format('H:i'),
                'selectedPULocation' => $request->selectedPULocation,
                'selectedRLocation' => $request->selectedRLocation,
            ]
        ]);
    }

}
