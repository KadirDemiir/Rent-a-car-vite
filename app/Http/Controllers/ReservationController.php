<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Discount;
use App\Models\DropPrice;
use App\Models\Locations;
use App\Models\Price;
use App\Models\Reservation;
use App\Models\ReservationExtra;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        foreach ($cars as $car) {
            if ($this->isCarAvailable($car->id, $request->startDateTime, $request->finishDateTime, $request->PULocation)) {
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

        if($start >= $end || $start < Carbon::now() || $end < Carbon::now())
        {
            return Inertia::render('Home');
        }

        if (!$this->isCarAvailable($car->id, $request->startDateTime, $request->finishDateTime, $request->PULocation)) {
            return Inertia::render('Home');
        }

        $this->CalcPrice($car, $request->startDateTime, $request->finishDateTime, $request->PULocation, $request->RLocation);
        $user = auth()->user();

        return Inertia::render('SelectExtras', [
            'car' => $car,
            'auth_user' => $user ?? null,
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

        $dailyPrice = Price::select('base_price', 'price', 'currency_id', 'min_days', 'max_days')
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
            $car->daily_price = $dailyPrice->base_price;
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

        $baseDailyPrice = $car->daily_price ?? 0;
        $discountData = $this->calculateDiscount($car->id, $startDateTime, $finishDateTime, $baseDailyPrice);

        $discountedDailyPrice = max(0, $baseDailyPrice - $discountData['amount']);
        $totalRentalPrice = $discountedDailyPrice * $dayCount;

        $car->discount_data = $discountData;

        $car->calculated_price = [
            'base_daily_price' => $baseDailyPrice,
            'daily_discount_amount' => $discountData['amount'],
            'final_daily_price' => $discountedDailyPrice,
            'total_rental_price' => $totalRentalPrice,
            'drop_price' => $car->drop_price ?? 0,
            'grand_total' => $totalRentalPrice + ($car->drop_price ?? 0)
        ];
    }

    public function calculateDiscount($carId, $start, $end, $unitPrice = 0){
        $segmentId = Car::find($carId)->segment_id;
        $startDate = Carbon::parse($start);
        $endDate = Carbon::parse($end);

        $diff = $startDate->diff($endDate);
        $days = $diff->days;
        if ($diff->h > 3)
            $days++;
        $days = $days ?: 1;

        $discountRule = Discount::query()
            ->where('status', 'active')
            ->where('start_date', '<=', $startDate)
            ->where('end_date', '>=', $endDate)
            ->where('min_days', '<=', $days)
            ->where('max_days', '>=', $days)
            ->where(function ($query) use ($carId, $segmentId) {
                $query->where(function ($q) use ($carId) {
                    $q->where('target_type', 'car')
                        ->where('car_id', $carId);
                })
                    ->orWhere(function ($q) use ($segmentId) {
                        $q->where('target_type', 'segment')
                            ->where('segment_id', $segmentId);
                    })
                    ->orWhere('target_type', 'all');
            })
            ->orderByRaw("FIELD(target_type, 'car', 'segment', 'all')")
            ->orderBy('discount_value', 'desc')
            ->first();

        if (!$discountRule) {
            return [
                'has_discount' => false,
                'amount' => 0,
                'discount_value' => 0,
                'meta' => null
            ];
        }

        $discountAmount = 0;

        if ($discountRule->discount_type === 'percentage') {
            $discountAmount = $unitPrice * $discountRule->discount_value;
        } else {
            $discountAmount = $discountRule->discount_value;
        }

        return [
            'has_discount' => true,
            'amount' => round($discountAmount, 2),
            'value' => $discountRule->discount_value,
            'meta' => $discountRule
        ];
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

            if (!$this->isCarAvailable($validated['car_id'], $validated['start_date_time'], $validated['finish_date_time'], $validated['pick_up_location_id'])) {
                return response()->json(['error' => 'Car is not available'], 409);
            }

            $extrasArray = json_decode($validated['extras'] ?? '[]', true);
            $extras_total_price = collect($extrasArray)->sum(function ($extra) {
                return $extra['price'] * $extra['count'];
            });

            $baseDailyPrice = $validated['daily_price'];
            $drop_cost = $validated['drop_price'];

            $discountData = $this->calculateDiscount(
                $validated['car_id'],
                $validated['start_date_time'],
                $validated['finish_date_time'],
                $baseDailyPrice
            );

            $dailyDiscountAmount = $discountData['amount'];
            $discountRule = $discountData['meta'] ?? null;

            $totalDiscountAmount = $dailyDiscountAmount * $validated['total_days'];
            $discountedDailyPrice = max(0, $baseDailyPrice - $dailyDiscountAmount);

            $rental_cost = $validated['total_days'] * $discountedDailyPrice;

            $total_price = $rental_cost + $drop_cost + $extras_total_price;
            $total_price = max(0, $total_price);

            $reservation = Reservation::create([
                'car_id' => $validated['car_id'],
                'pickup_datetime' => Carbon::parse($validated['start_date_time'], 'Europe/Istanbul')->setTimezone('UTC'),
                'return_datetime' => Carbon::parse($validated['finish_date_time'], 'Europe/Istanbul')->setTimezone('UTC'),
                'currency_id' => $validated['currency_id'],
                'pickup_location_id' => $validated['pick_up_location_id'],
                'return_location_id' => $validated['return_location_id'],
                'rental_days' => $validated['total_days'],
                'daily_price' => $baseDailyPrice,
                'drop_price' => $validated['drop_price'] ?? null,
                'extras_total' => $extras_total_price,
                'discount_amount' => $totalDiscountAmount,
                'discount_type' => $discountRule ? $discountRule->discount_type : null,
                'discount_target' => $discountRule ? $discountRule->target_type : null,
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

    public function isCarAvailable($carId, $startDateTime, $finishDateTime, $pickupLocationId){

        if(Car::find($carId)->status === 'unavailable') return false;
            $bufferHours = 4;

            $reqStart = Carbon::parse($startDateTime);
            $reqEnd = Carbon::parse($finishDateTime);

            $hasConflict = Reservation::where('car_id', $carId)
                ->whereIn('status', ['confirmed', 'pending', 'active'])
                ->where(function ($query) use ($reqStart, $reqEnd, $bufferHours) {
                    $query->where('pickup_datetime', '<', $reqEnd)
                        ->whereRaw("DATE_ADD(return_datetime, INTERVAL ? HOUR) > ?", [$bufferHours, $reqStart]);
                })
                ->exists();

            if ($hasConflict)
                return false;

            $lastReservation = Reservation::where('car_id', $carId)
                ->whereIn('status', ['pending',  'confirmed', 'completed', 'active'])
                ->whereRaw("DATE_ADD(return_datetime, INTERVAL ? HOUR) <= ?", [$bufferHours, $reqStart])
                ->orderBy('return_datetime', 'desc')
                ->first();

            if ($lastReservation) {
                return $lastReservation->return_location_id == $pickupLocationId;
            } else {
                $car = Car::find($carId);
                return $car && $car->status == 'available' && $car->current_location_id == $pickupLocationId;
            }
    }

    public function showReservations(){
        return Inertia::render('adminPanel/reservation/Reservations');
    }

    public function rejectReservation($id)
    {
        $res = Reservation::findOrFail($id);
        if($res->status !== 'pending')
            return response()->json(['error' => 'Reservation not pending'], 422);
        $res->payment_status = 'failed';
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
        return response()->json(['success' => 'Reservation confirmed'], 200);
    }

    public function myReservations()
    {
        $user = auth()->user();
        $reservations = Reservation::where('email', $user->email)
            ->with(['car.photos', 'pickupLocation', 'returnLocation', 'car.brandKey', 'car.modelKey', 'currency'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Profile/MyReservations', [
            'reservations' => $reservations
        ]);
    }

    public function cancelReservation($id){
        $user = auth()->user();
        $reservation = Reservation::where('email', $user->email)->where('id', $id)->firstOrFail();

        if ($reservation->status !== 'pending') {
            return response()->json(['error' => 'Only pending reservations can be cancelled.'], 422);
        }

        $reservation->status = 'cancelled';
        $reservation->save();

            $reservations = Reservation::where('email', $user->email)
                ->with(['car.photos', 'pickupLocation', 'returnLocation', 'car.brandKey', 'car.modelKey', 'currency'])
                ->orderBy('created_at', 'desc')
                ->get();

        return response()->json(['success' => 'Reservation cancelled successfully.', 'reservations' => $reservations], 200);
    }

    public function checkReservationPage(Request $request){

        if (auth()->check() && !$request->filled('reservation_id') && !$request->filled('email')) {
            return to_route('myReservations');
        }   

        if ($request->filled('reservation_id') && $request->filled('email')) {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'email' => 'required|email',
                'reservation_id' => 'required|numeric',
            ]);

            if ($validator->fails()) {
                if ($request->wantsJson()) {
                    return response()->json(['errors' => $validator->errors()], 422);
                }
                return Inertia::render('CheckReservation')->withErrors($validator);
            }

            $reservation = Reservation::where('id', $request->reservation_id)
                ->where('email', $request->email)
                ->with(['car.photos', 'pickupLocation', 'returnLocation', 'car.brandKey', 'car.modelKey', 'currency'])
                ->first();

            if ($reservation) {
                return Inertia::render('GuestReservationDetails', [
                    'reservation' => $reservation
                ]);
            }

            return Inertia::render('CheckReservation')->withErrors([
                'email' => 'Reservation not found or email does not match.'
            ]);
        }

        return Inertia::render('CheckReservation');
    }

    public function checkReservation(Request $request){
        $validated = $request->validate([
            'email' => 'required|email',
            'reservation_id' => 'required|numeric',
        ]);

        $exists = Reservation::where('id', $validated['reservation_id'])
            ->where('email', $validated['email'])
            ->exists();

        if (!$exists) {
            return back()->withErrors([
                'email' => 'Reservation not found or email does not match.'
            ]);
        }

        return to_route('checkReservationPage', $validated);
    }

    public function guestCancelReservation(Request $request, $id){
        $request->validate([
            'email' => 'required|email'
        ]);

        $reservation = Reservation::where('id', $id)
            ->where('email', $request->email)
            ->firstOrFail();

        if ($reservation->status !== 'pending') {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Only pending reservations can be cancelled.', 'status' => 'error'], 422);
            }
            return back()->with('error', 'Only pending reservations can be cancelled.');
        }

        $reservation->status = 'cancelled';
        $reservation->save();

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Reservation cancelled successfully.',
                'status' => 'success',
                'reservation_status' => 'cancelled'
            ]);
        }

        return back()->with('success', 'Reservation cancelled successfully.');
    }

    public function startRental($id)
    {
        $reservation = Reservation::findOrFail($id);
        $car = Car::findOrFail($reservation->car_id);

        if ($reservation->status !== 'confirmed') {
            return response()->json(['error' => 'Cannot start rental for this reservation.'], 422);
        }

        $reservation->status = 'active';
        $reservation->save();

        $car->status = 'rented';
        $car->save();


        return response()->json(['success' => 'Rental started successfully.', 'data' => $reservation]);
    }

    public function completeRental($id)
    {
        $reservation = Reservation::findOrFail($id);
        $car = Car::findOrFail($reservation->car_id);   

        if ($reservation->status !== 'active') {
             return response()->json(['error' => 'Cannot complete rental for an inactive reservation.'], 422);
        }

        $reservation->status = 'completed';
        $reservation->save();

        $car->status = 'available';
        $car->save();

        return response()->json(['success' => 'Rental completed successfully.', 'data' => $reservation]);
    }
}