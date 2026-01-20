<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\DropPrice;
use App\Models\Locations;
use App\Models\Price;
use App\Models\Reservation;
use App\Models\ReservationExtra;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;
use function Laravel\Prompts\error;

class ReservationController extends Controller
{
    public function searchReservations(Request $request)
    {
        Log::info('request', [$request->all()]);
        if (!$request->has(['startDateTime', 'finishDateTime', 'PULocation', 'RLocation'])) {
            return Inertia::render('SearchReservations', ['availableCars' => []]);
        }

        $request->validate([
            'startDateTime' => 'required|date|after:today',
            'finishDateTime' => 'required|date|after:startDateTime',
            'PULocation' => 'required|exists:locations,id',
            'RLocation' => 'required|exists:locations,id',
        ]);

        if($request->startDateTime >= $request->finishDateTime || $request->startDateTime < Carbon::now() || $request->finishDateTime < Carbon::now())
            return to_route('home');

        $cars = Car::with('location', 'photos', 'brandKey', 'modelKey', 'price')->get();
        $availableCars = [];

        $reqStart = Carbon::parse($request->startDateTime);
        $reqEnd = Carbon::parse($request->finishDateTime);
        Log::info('requestDate', [$reqStart, $reqEnd]);
        foreach ($cars as $car) {
            $isAvailable = true;
            $eachReservations = Reservation::where('car_id', $car->id)->get();
            Log::info('eachReservations', [$car->id, $eachReservations]);
            foreach($eachReservations as $eachRes){
                $resStart = Carbon::parse($eachRes->pickup_datetime)->format('Y-m-d H:i:s');
                $resEnd = Carbon::parse($eachRes->return_datetime)->format('Y-m-d H:i:s');
            Log::info('resDate, reqDay', [$resStart, $resEnd, $reqStart, $reqEnd]);
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
        $validated = $request->validate([
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
            'params' => [
                'startDateTime' => $validated['startDateTime'],
                'finishDateTime' => $validated['finishDateTime'],
                'PULocation' => Locations::find($validated['PULocation']),
                'RLocation' => Locations::find($validated['RLocation']),
            ]
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

    public function createReservation(Request $request){
        try {
            $validated = $request->validate([
                'car_id' => 'required|exists:cars,id',
                'start_date_time' => 'required|date',
                'finish_date_time' => 'required|date|after:start_date_time',
                'pick_up_location_id' => 'required|exists:locations,id',
                'return_location_id' => 'required|exists:locations,id',
                'total_days' => 'required|numeric|min:1',
                'daily_price' => 'required|numeric|min:1',
                'drop_price' => 'required|numeric|min:0',
                'currency_id' => 'required|exists:currencies,id',
                'user_info.name' => 'required|string',
                'user_info.surname' => 'required|string',
                'user_info.email' => 'required|email',
                'user_info.phone' => 'required|string',
                'user_info.address' => 'required|string',
                'user_info.notes' => 'nullable|string',
                'user_info.id' => 'required',
                'user_info.birthday' => 'required|date|before:' . Carbon::now()->subYears(18)->format('Y-m-d'),
                'user_info.arrival_flight_no' => 'nullable|string',
                'user_info.return_flight_no' => 'nullable|string',
                'extras' => 'nullable|json',
            ]);

            DB::beginTransaction();
            $eachReservations = Reservation::where('car_id', $validated['car_id'])->latest()->get();
            $start = Carbon::parse($validated['start_date_time']);
            $end = Carbon::parse($validated['finish_date_time']);

            $conflict = $this->hasConflict($eachReservations, $start, $end);
            Log::info('hasConflict', ['conflict' => $conflict]);
            if($conflict) {
                return response()->json(['error' => 'Conflict on reservation'], 409);
            }

            $extrasArray = json_decode($validated['extras'] ?? '[]', true);
            $extras_total_price = collect($extrasArray)->sum(function ($extra) {
                return $extra['price'] * $extra['count'];
            });

            $rental_cost = $validated['total_days'] * $validated['daily_price'];
            $drop_cost = $validated['drop_price'];
            $total_price = $rental_cost + $drop_cost + $extras_total_price;

            $reservation = Reservation::create([
                'car_id' => $validated['car_id'],
                'pickup_datetime' => $validated['start_date_time'],
                'return_datetime' => $validated['finish_date_time'],
                'currency_id' => $validated['currency_id'],
                'pickup_location_id' => $validated['pick_up_location_id'],
                'return_location_id' => $validated['return_location_id'],
                'rental_days' => $validated['total_days'],
                'daily_price' => $validated['daily_price'],
                'drop_price' => $validated['drop_price'],
                'extras_total' => $extras_total_price,
                'total_price' => $total_price,
                'name' => $validated['user_info']['name'],
                'surname' => $validated['user_info']['surname'],
                'email' => $validated['user_info']['email'],
                'phone_number' => $validated['user_info']['phone'],
                'address' => $validated['user_info']['address'],
                'notes' => $validated['user_info']['notes'],
                'birthday' => $validated['user_info']['birthday'],
                'arrival_flight_no' => $validated['user_info']['arrival_flight_no'] ?? null,
                'return_flight_no' => $validated['user_info']['return_flight_no'] ?? null,
                'tc_number' => $validated['user_info']['id'],
            ]);

            foreach($extrasArray as $extraId => $e){
                ReservationExtra::create([
                    'reservation_id' => $reservation->id,
                    'extra_service_id' => $extraId,
                    'price' => $e['price'],
                    'quantity' => $e['count'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'reservation' => $reservation
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $exception){
            DB::rollBack();
            return response()->json([
                'error' => 'Reservation creation failed',
                'message' => $exception->getMessage()
            ], 500);
        }
    }


    public function hasConflict($eachReservations, $start, $end){
        foreach($eachReservations as $eachRes){
            $resStart = Carbon::parse($eachRes->pickup_datetime);
            $resEnd = Carbon::parse($eachRes->return_datetime);

            if ($resStart < $end && $resEnd > $start) {
                return true;
            }
        }
        if($start >= $end || $start < Carbon::now() || $end < Carbon::now())
            return true;

        return false;
    }

    public function showReservations(){
        return Inertia::render('adminPanel/reservation/Reservations');
    }

    public function rejectReservation($id)
    {
        $res = Reservation::findOrFail($id);
        if($res->status !== 'pending')
            return response()->json(['error' => 'Reservation not pending'], 422);
        $res->payment_status = 'rejected';
        $res->status = 'cancelled';
        $res->save();
        return response()->json(['success' => 'Reservation cancelled'], 200);
    }

    public function approveReservation($id)
    {
        $res = Reservation::findOrFail($id);
        if($res->status !== 'pending')
            return response()->json(['error' => 'Reservation not pending'], 422);
        $res->status = 'confirmed';
       $res->payment_status = 'paid';
        $res->save();
        return response()->json(['success' => 'Reservation cancelled'], 200);
    }
}
