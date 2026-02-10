<?php

namespace App\Http\Controllers;

use App\Models\CarGroup;
use App\Models\Discount;
use App\Models\DropPrice;
use App\Models\Locations;
use App\Models\Reservation;
use App\Models\ReservationExtra;
use App\Models\Translation;
use App\Models\Car;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

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

        $reqStart = Carbon::parse($request->startDateTime);
        $reqEnd = Carbon::parse($request->finishDateTime);
        $bufferHours = 4;

        if ($reqStart >= $reqEnd || $reqStart->isPast()) {
            return to_route('home');
        }

        $groups = CarGroup::select([
            'id',
            'name',
            'segment_id',
            'body_type_id',
            'fuel_id',
            'transmission_id',
            'seat_count',
            'trunk_capacity',
            'deposit',
            'sort_order',
        ])
            ->with([
                'photos' => function ($q) {
                    $q->where('is_cover', 1)->select('car_group_id', 'photo_path', 'is_cover');
                },
                'price' => function ($query) use ($reqStart) {
                    $query->select('car_group_id', 'base_price', 'price', 'currency_id', 'min_days', 'max_days')
                        ->where('month', $reqStart->month)
                        ->where('is_active', 1)
                        ->with('currency:id,code,exchange_rate');
                },
                'cars:id,car_group_id',
            ])
            ->orderBy('sort_order', 'asc')
            ->get();

        $groupIds = $groups->pluck('id')->toArray();
        $vehicleCountByGroup = \App\Models\Car::whereIn('car_group_id', $groupIds)
            ->whereIn('status', ['available', 'rented'])
            ->selectRaw('car_group_id, count(*) as cnt')
            ->groupBy('car_group_id')
            ->pluck('cnt', 'car_group_id');

        $overlappingByGroup = Reservation::whereIn('car_group_id', $groupIds)
            ->whereIn('status', ['confirmed', 'active'])
            ->where('pickup_datetime', '<', $reqEnd)
            ->whereRaw('DATE_ADD(return_datetime, INTERVAL ? HOUR) > ?', [$bufferHours, $reqStart])
            ->selectRaw('car_group_id, count(*) as cnt')
            ->groupBy('car_group_id')
            ->pluck('cnt', 'car_group_id');

        $dayCount = $reqStart->diffInDays($reqEnd);
        $diffHours = $reqStart->diffInHours($reqEnd) % 24;
        if ($diffHours > 3) $dayCount += 1;
        if ($dayCount == 0) $dayCount = 1;

        $discountRules = $this->getApplicableDiscounts($groups, $reqStart, $reqEnd, $dayCount);

        $locationIds = [$request->PULocation, $request->RLocation];
        $selectedLocations = Locations::whereIn('id', $locationIds)->select('id', 'name')->get();
        $puLocation = $selectedLocations->firstWhere('id', (int) $request->PULocation);
        $rLocation = $selectedLocations->firstWhere('id', (int) $request->RLocation);

        $drop = DropPrice::select('price', 'currency')
            ->where('from_location_id', $request->PULocation)
            ->where('to_location_id', $request->RLocation)
            ->first();

        $availableCars = [];

        foreach ($groups as $group) {
            $vehiclesCount = (int) ($vehicleCountByGroup[$group->id] ?? 0);
            $overlappingCount = (int) ($overlappingByGroup[$group->id] ?? 0);
            if ($vehiclesCount <= $overlappingCount) {
                continue;
            }

            $this->CalcPriceOptimized($group, $reqStart, $reqEnd, $drop, $dayCount, $discountRules);

            if ($group->daily_price !== null) {
                $availableCars[] = [
                    'id' => $group->id,
                    'name' => $group->name,
                    'segment_id' => $group->segment_id,
                    'body_type_id' => $group->body_type_id,
                    'fuel_id' => $group->fuel_id,
                    'transmission_id' => $group->transmission_id,
                    'seat_count' => $group->seat_count,
                    'trunk_capacity' => $group->trunk_capacity,
                    'deposit' => $group->deposit,
                    'sort_order' => $group->sort_order,
                    'photos' => $group->photos,
                    'total_days' => $group->total_days,
                    'daily_price' => $group->daily_price,
                    'daily_price_currency' => $group->daily_price_currency,
                    'drop_price' => $group->drop_price,
                    'drop_currency' => $group->drop_currency,
                    'calculated_price' => $group->calculated_price,
                    'discount_data' => [
                        'has_discount' => $group->discount_data['has_discount'] ?? false,
                        'amount' => $group->discount_data['amount'] ?? 0,
                        'value' => $group->discount_data['value'] ?? 0,
                    ],
                ];
            }
        }

        return Inertia::render('SearchReservations', [
            'availableCars' => $availableCars,
            'reservation' => [
                'startDate' => $reqStart->toDateString(),
                'startTime' => $reqStart->format('H:i'),
                'finishDate' => $reqEnd->toDateString(),
                'finishTime' => $reqEnd->format('H:i'),
                'selectedPULocation' => $puLocation,
                'selectedRLocation' => $rLocation,
            ],
            'locations' => Locations::select('id', 'name')->where('is_active', true)->get()
        ]);
    }

    private function getApplicableDiscounts($groups, Carbon $startDate, Carbon $endDate, int $days): array
    {
        $groupIds = $groups->pluck('id')->toArray();
        $segmentIds = $groups->pluck('segment_id')->unique()->toArray();

        $discounts = Discount::query()
            ->where('status', 'active')
            ->where('start_date', '<=', $startDate)
            ->where('end_date', '>=', $endDate)
            ->where('min_days', '<=', $days)
            ->where('max_days', '>=', $days)
            ->where(function ($query) use ($groupIds, $segmentIds) {
                $query->where(function ($q) use ($groupIds) {
                    $q->where('target_type', 'car')
                        ->whereIn('car_group_id', $groupIds);
                })
                    ->orWhere(function ($q) use ($segmentIds) {
                        $q->where('target_type', 'segment')
                            ->whereIn('segment_id', $segmentIds);
                    })
                    ->orWhere('target_type', 'all');
            })
            ->orderByRaw("FIELD(target_type, 'car', 'segment', 'all')")
            ->orderBy('discount_value', 'desc')
            ->get();

        return [
            'by_car' => $discounts->where('target_type', 'car')->keyBy('car_group_id'),
            'by_segment' => $discounts->where('target_type', 'segment')->keyBy('segment_id'),
            'global' => $discounts->where('target_type', 'all')->first(),
        ];
    }

    private function CalcPriceOptimized($group, Carbon $start, Carbon $finish, $drop, int $dayCount, array $discountRules)
    {
        $group->total_days = $dayCount;
        $group->drop_price = $drop->price ?? null;
        $group->drop_currency = $drop->currency ?? null;

        $matchingPrice = null;
        if ($group->relationLoaded('price') && $group->price) {
            $matchingPrice = $group->price->first(function ($price) use ($dayCount) {
                return $dayCount >= $price->min_days && $dayCount <= $price->max_days;
            });
        }

        $baseDailyPrice = $matchingPrice->base_price ?? 0;
        $group->daily_price = $baseDailyPrice;
        $group->daily_price_currency = $matchingPrice->currency ?? null;

        $discountData = $this->getDiscountFromCache($group, $baseDailyPrice, $discountRules);

        $discountedDailyPrice = max(0, $baseDailyPrice - ($discountData['amount'] ?? 0));
        $totalRentalPrice = $discountedDailyPrice * $dayCount;
        $dropPriceValue = $group->drop_price ?? 0;

        $group->discount_data = $discountData;

        $group->calculated_price = [
            'base_daily_price' => $baseDailyPrice,
            'daily_discount_amount' => $discountData['amount'] ?? 0,
            'final_daily_price' => $discountedDailyPrice,
            'total_rental_price' => $totalRentalPrice,
            'drop_price' => $dropPriceValue,
            'grand_total' => $totalRentalPrice + $dropPriceValue,
        ];
    }

    private function getDiscountFromCache($group, float $unitPrice, array $discountRules): array
    {
        $discountRule = $discountRules['by_car']->get($group->id)
            ?? $discountRules['by_segment']->get($group->segment_id)
            ?? $discountRules['global'];

        if (!$discountRule) {
            return [
                'has_discount' => false,
                'amount' => 0,
                'discount_value' => 0,
                'meta' => null
            ];
        }

        $discountAmount = $discountRule->discount_type === 'percentage'
            ? $unitPrice * $discountRule->discount_value
            : $discountRule->discount_value;

        return [
            'has_discount' => true,
            'amount' => round($discountAmount, 2),
            'value' => $discountRule->discount_value,
            'meta' => $discountRule
        ];
    }


    public function initiateDraft(Request $request)
    {
        $validated = $request->validate([
            'car_group_id' => 'required|exists:car_groups,id',
            'startDateTime' => 'required|date',
            'finishDateTime' => 'required|date|after:startDateTime',
            'PULocation' => 'required|exists:locations,id',
            'RLocation' => 'required|exists:locations,id',
        ]);

        $start = Carbon::parse($validated['startDateTime']);
        if ($start < now()) {
            throw ValidationException::withMessages(['startDateTime' => 'Geçmiş tarih seçilemez.']);
        }

        $key = 'res_draft_' . Str::random(40);
        Cache::put($key, $validated, now()->addMinutes(30));

        return response()->json([
            'status' => 'success',
            'redirect_url' => route('reservation-create', ['ref' => $key]),
        ]);
    }

    public function showExtras(Request $request)
    {
        $ref = $request->input('ref');
        $validated = $ref ? Cache::get($ref) : null;

        if (!$validated) {
            return to_route('home')->with('error', 'Oturum süreniz doldu.');
        }

        $carGroupId = $validated['car_group_id'] ?? $validated['car_id'] ?? null;
        if (!$carGroupId) {
            return to_route('home')->with('error', 'Geçersiz oturum.');
        }

        $startDateTime = Carbon::parse($validated['startDateTime']);

        $car = CarGroup::with([
            'photos',
            'price' => function ($query) use ($startDateTime) {
                $query->select('car_group_id', 'base_price', 'price', 'currency_id', 'min_days', 'max_days')
                    ->where('month', $startDateTime->month)
                    ->where('is_active', 1)
                    ->with('currency:id,code,exchange_rate');
            },
        ])->findOrFail($carGroupId);

        if (!$this->isCarGroupAvailable((int) $carGroupId, $validated['startDateTime'], $validated['finishDateTime'])) {
            return to_route('home')->with('error', 'Araç artık uygun değil.');
        }

        $drop = DropPrice::select('price', 'currency')
            ->where('from_location_id', $validated['PULocation'])
            ->where('to_location_id', $validated['RLocation'])
            ->first();

        $this->CalcPrice($car, $validated['startDateTime'], $validated['finishDateTime'], $validated['PULocation'], $validated['RLocation'], $drop);

        return Inertia::render('SelectExtras', [
            'car' => $car,
            'auth_user' => auth()->user(),
            'params' => [
                'startDateTime' => $validated['startDateTime'],
                'finishDateTime' => $validated['finishDateTime'],
                'PULocation' => Locations::find($validated['PULocation']),
                'RLocation' => Locations::find($validated['RLocation']),
                'ref' => $ref,
            ],
        ]);
    }


public function CalcPrice($car, $startDateTime, $finishDateTime, $puLocationId, $rLocationId, $drop = null)
{
    $start = Carbon::parse($startDateTime);
    $finish = Carbon::parse($finishDateTime);

    $dayCount = $start->diffInDays($finish);

    $diffHours = $start->diffInHours($finish) % 24;

    if ($diffHours > 3) {
        $dayCount += 1;
    }

    if ($dayCount == 0) {
        $dayCount = 1;
    }

    $car->total_days = $dayCount;

/*     $drop = DropPrice::select('price', 'currency')
        ->where('from_location_id', $puLocationId)
        ->where('to_location_id', $rLocationId)
        ->first();
 */
/*     $dailyPrice = Price::select('base_price', 'price', 'currency_id', 'min_days', 'max_days')
        ->where('car_id', $car->id)
        ->where('is_active', 1)
        ->where('month', $start->month)
        ->where('min_days', '<=', $dayCount)
        ->where('max_days', '>=', $dayCount)
        ->orderBy('base_price', 'asc')
        ->with('currency:id,code,exchange_rate')
        ->first(); */

    //$car->daily_price = $dailyPrice->base_price ?? null;
    //$car->daily_price_currency = $dailyPrice->currency ?? null;

    $car->drop_price = $drop->price ?? null;
    $car->drop_currency = $drop->currency ?? null;

    // Find the correct price tier based on dayCount from the loaded price collection
    $matchingPrice = null;
    if ($car->relationLoaded('price') && $car->price) {
        $matchingPrice = $car->price->first(function ($price) use ($dayCount) {
            return $dayCount >= $price->min_days && $dayCount <= $price->max_days;
        });
    }

    $baseDailyPrice = $matchingPrice->base_price ?? 0;
    $car->daily_price = $baseDailyPrice;
    $car->daily_price_currency = $matchingPrice->currency ?? null;

    $discountData = $this->calculateDiscount($car, $startDateTime, $finishDateTime, $baseDailyPrice);

    $discountedDailyPrice = max(0, $baseDailyPrice - ($discountData['amount'] ?? 0));
    $totalRentalPrice = $discountedDailyPrice * $dayCount;
    $dropPriceValue = $car->drop_price ?? 0;

    $car->discount_data = $discountData;

    $car->calculated_price = [
        'base_daily_price'      => $baseDailyPrice,
        'daily_discount_amount' => $discountData['amount'] ?? 0,
        'final_daily_price'     => $discountedDailyPrice,
        'total_rental_price'    => $totalRentalPrice,
        'drop_price'            => $dropPriceValue,
        'grand_total'           => $totalRentalPrice + $dropPriceValue
    ];
}

    public function calculateDiscount($carGroup, $start, $end, $unitPrice = 0): array
    {
        if (!$carGroup instanceof CarGroup) {
            $carGroup = CarGroup::find($carGroup);
            if (!$carGroup) {
                return [
                    'has_discount' => false,
                    'amount' => 0,
                    'discount_value' => 0,
                    'meta' => null,
                ];
            }
        }

        $groupId = $carGroup->id;
        $segmentId = $carGroup->segment_id;
        $startDate = Carbon::parse($start);
        $endDate = Carbon::parse($end);
        $diff = $startDate->diff($endDate);
        $days = $diff->days;
        if ($diff->h > 3) $days++;
        $days = $days ?: 1;

        $discountRule = Discount::query()
            ->where('status', 'active')
            ->where('start_date', '<=', $startDate)
            ->where('end_date', '>=', $endDate)
            ->where('min_days', '<=', $days)
            ->where('max_days', '>=', $days)
            ->where(function ($query) use ($groupId, $segmentId) {
                $query->where(function ($q) use ($groupId) {
                    $q->where('target_type', 'car')->where('car_group_id', $groupId);
                })
                    ->orWhere(function ($q) use ($segmentId) {
                        $q->where('target_type', 'segment')->where('segment_id', $segmentId);
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
                'meta' => null,
            ];
        }

        $discountAmount = $discountRule->discount_type === 'percentage'
            ? $unitPrice * $discountRule->discount_value
            : $discountRule->discount_value;

        return [
            'has_discount' => true,
            'amount' => round($discountAmount, 2),
            'value' => $discountRule->discount_value,
            'meta' => $discountRule,
        ];
    }

    public function createReservation(Request $request)
    {
        try {
            $validated = $request->validate([
                'car_group_id' => 'required|exists:car_groups,id',
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
                'lang' => 'required|string',
            ]);

            DB::beginTransaction();

            if (!$this->isCarGroupAvailable((int) $validated['car_group_id'], $validated['start_date_time'], $validated['finish_date_time'])) {
                return response()->json(['error' => 'CarGroup is not available'], 409);
            }

            $extrasArray = json_decode($validated['extras'] ?? '[]', true);
            $extras_total_price = collect($extrasArray)->sum(function ($extra) {
                return $extra['price'] * $extra['count'];
            });

            $baseDailyPrice = $validated['daily_price'];
            $drop_cost = $validated['drop_price'];

            $discountData = $this->calculateDiscount(
                (int) $validated['car_group_id'],
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

            $exchange_rate = \App\Models\Currency::findOrFail($validated['currency_id'])->exchange_rate;

            $reservation = Reservation::create([
                'car_group_id' => $validated['car_group_id'],
                'pickup_datetime' => Carbon::parse($validated['start_date_time'], 'Europe/Istanbul')->setTimezone('UTC'),
                'return_datetime' => Carbon::parse($validated['finish_date_time'], 'Europe/Istanbul')->setTimezone('UTC'),
                'currency_id' => $validated['currency_id'],
                'exchange_rate' => $exchange_rate,
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
                'identity_number' => $validated['user_info']['id'],
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
            $reservation->refresh();

            $reservation->load(['carGroup.brandKey:id,key', 'carGroup.modelKey:id,key', 'pickupLocation:id,name', 'returnLocation:id,name', 'currency:id,symbol']);
            $lang_id = \App\Models\Language::where('code', $validated['lang'])->first()->id;

            $reservation->notify(new \App\Notifications\CustomEmailNotification('reservation_created', [
                'user_name' => $reservation->name,
                'reference_code' => $reservation->reference_code,
                'car_name' => Translation::where('language_id', $lang_id)->where('translation_key_id', $reservation->carGroup->brandKey->id)->first()->value . ' ' . Translation::where('language_id', $lang_id)->where('translation_key_id', $reservation->carGroup->modelKey->id)->first()->value,
                'tracking_url'   => $reservation->tracking_url,
                'pickup_location' => $reservation->pickupLocation->name,
                'return_location' => $reservation->returnLocation->name,
                'pickup_date' => $reservation->pickup_datetime->setTimezone('Europe/Istanbul')->format('d.m.Y H:i'),
                'return_date' => $reservation->return_datetime->setTimezone('Europe/Istanbul')->format('d.m.Y H:i'),
                'total_price' => number_format($reservation->total_price * $reservation->exchange_rate, 2, ',', '.') . ' ' . $reservation->currency->symbol,
                'lang' => $validated['lang']
            ]));

            return response()->json([
                'success' => true,
                'reference_code' => $reservation->reference_code
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $exception){
            DB::rollBack();
            \Log::error('Reservation Error: ' . $exception->getMessage(), [
                'user' => $request->input('user_info.email'),
                'trace' => $exception->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Reservation creation failed',
                'message' => 'An unexpected error occurred.'
            ], 500);
        }
    }

    public function isCarGroupAvailable(int $carGroupId, $startDateTime, $finishDateTime): bool
    {
        $bufferHours = 4;
        $reqStart = Carbon::parse($startDateTime);
        $reqEnd = Carbon::parse($finishDateTime);

        $vehiclesCount = \App\Models\Car::where('car_group_id', $carGroupId)
            ->whereIn('status', ['available', 'rented'])
            ->count();

        $overlappingCount = Reservation::where('car_group_id', $carGroupId)
            ->whereIn('status', ['confirmed', 'pending', 'active'])
            ->where('pickup_datetime', '<', $reqEnd)
            ->whereRaw('DATE_ADD(return_datetime, INTERVAL ? HOUR) > ?', [$bufferHours, $reqStart])
            ->count();

        return $vehiclesCount > $overlappingCount;
    }

    public function showReservations(){
        return Inertia::render('adminPanel/reservation/Reservations');
    }

    public function rejectReservation(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $langCode = $request->input('lang');
        if($reservation->status !== 'pending')
            return response()->json(['error' => 'Reservation not pending'], 422);
        $reservation->payment_status = 'failed';
        $reservation->status = 'cancelled';
        $reservation->save();

        $lang = \App\Models\Language::where('code', $langCode)->first();
        $lang_id = $lang ? $lang->id : 1;

        $reservation->load(['carGroup.brandKey', 'carGroup.modelKey', 'pickupLocation', 'returnLocation', 'currency']);
        $brandName = Translation::where('language_id', $lang_id)
            ->where('translation_key_id', $reservation->carGroup->brandKey->id)
            ->value('value');

        $modelName = Translation::where('language_id', $lang_id)
            ->where('translation_key_id', $reservation->carGroup->modelKey->id)
            ->value('value');

        $reservation->notify(new \App\Notifications\CustomEmailNotification('reservation_decline', [
            'user_name' => $reservation->name,
            'reference_code' => $reservation->reference_code,
            'car_name' => $brandName . ' ' . $modelName,
            'pickup_location' => $reservation->pickupLocation->name,
            'return_location' => $reservation->returnLocation->name,
            'pickup_date' => $reservation->pickup_datetime->setTimezone('Europe/Istanbul')->format('d.m.Y H:i'),
            'return_date' => $reservation->return_datetime->setTimezone('Europe/Istanbul')->format('d.m.Y H:i'),
            'total_price' => number_format($reservation->total_price * $reservation->exchange_rate, 2, ',', '.') . ' ' . $reservation->currency->symbol,
            'lang' => $langCode
        ]));
        return response()->json(['success' => 'Reservation cancelled'], 200);
    }

    public function approveReservation($id)
    {
        $validated = request()->validate([
            'lang' => 'required|string',
        ]);
        $reservation = Reservation::findOrFail($id);
        if($reservation->status !== 'pending')
            return response()->json(['error' => 'Reservation not pending'], 422);
        $reservation->status = 'confirmed';
        $reservation->payment_status = 'paid';
        $reservation->save();

        $lang = \App\Models\Language::where('code', $validated['lang'])->first();
        $lang_id = $lang ? $lang->id : 1;

        $reservation->load(['carGroup.brandKey', 'carGroup.modelKey', 'pickupLocation', 'returnLocation', 'currency']);
        $brandName = Translation::where('language_id', $lang_id)
            ->where('translation_key_id', $reservation->carGroup->brandKey->id)
            ->value('value');

        $modelName = Translation::where('language_id', $lang_id)
            ->where('translation_key_id', $reservation->carGroup->modelKey->id)
            ->value('value');

        $reservation->notify(new \App\Notifications\CustomEmailNotification('reservation_confirmation', [
            'user_name' => $reservation->name,
            'reference_code' => $reservation->reference_code,
            'car_name' => $brandName . ' ' . $modelName,
            'tracking_url'   => $reservation->tracking_url,
            'pickup_location' => $reservation->pickupLocation->name,
            'return_location' => $reservation->returnLocation->name,
            'pickup_date' => $reservation->pickup_datetime->setTimezone('Europe/Istanbul')->format('d.m.Y H:i'),
            'return_date' => $reservation->return_datetime->setTimezone('Europe/Istanbul')->format('d.m.Y H:i'),
            'total_price' => number_format($reservation->total_price * $reservation->exchange_rate, 2, ',', '.') . ' ' . $reservation->currency->symbol,
            'lang' => $lang->code
        ]));

        return response()->json(['success' => 'Reservation confirmed'], 200);
    }

    public function myReservations()
    {
        $user = auth()->user();
        $reservations = Reservation::where('email', $user->email)
            ->with(['carGroup.photos', 'pickupLocation', 'returnLocation', 'carGroup.brandKey', 'carGroup.modelKey', 'currency'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Profile/MyReservations', [
            'reservations' => $reservations,
        ]);
    }

    public function cancelReservation(Request $request)
    {
        $user = auth()->user();
        $langCode = $request->input('lang');

        $reservation = Reservation::where('email', $user->email)
            ->where('reference_code', $request->input('reference_code'))
            ->firstOrFail();

        if ($reservation->status !== 'pending') {
            return response()->json(['error' => 'Sadece beklemedeki rezervasyonlar iptal edilebilir.'], 422);
        }

        $reservation->status = 'cancelled';
        $reservation->save();

        $reservation->load(['carGroup.brandKey', 'carGroup.modelKey', 'pickupLocation', 'returnLocation', 'currency']);

        $lang = \App\Models\Language::where('code', $langCode)->first();
        $lang_id = $lang ? $lang->id : 1;

        $brandName = Translation::where('language_id', $lang_id)
            ->where('translation_key_id', $reservation->carGroup->brandKey->id)
            ->value('value');

        $modelName = Translation::where('language_id', $lang_id)
            ->where('translation_key_id', $reservation->carGroup->modelKey->id)
            ->value('value');

        $reservation->notify(new \App\Notifications\CustomEmailNotification('reservation_cancelled', [
            'user_name' => $reservation->name,
            'reference_code' => $reservation->reference_code,
            'car_name' => $brandName . ' ' . $modelName,
            'pickup_location' => $reservation->pickupLocation->name,
            'return_location' => $reservation->returnLocation->name,
            'pickup_date' => $reservation->pickup_datetime->setTimezone('Europe/Istanbul')->format('d.m.Y H:i'),
            'return_date' => $reservation->return_datetime->setTimezone('Europe/Istanbul')->format('d.m.Y H:i'),
            'total_price' => number_format($reservation->total_price * $reservation->exchange_rate, 2, ',', '.') . ' ' . $reservation->currency->symbol,
            'lang' => $langCode
        ]));

        $reservations = Reservation::where('email', $user->email)
            ->with(['carGroup.photos', 'pickupLocation', 'returnLocation', 'carGroup.brandKey', 'carGroup.modelKey', 'currency'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => 'Rezervasyon başarıyla iptal edildi.',
            'reservations' => $reservations,
        ], 200);
    }

    public function checkReservationPage(Request $request){

        if (auth()->check()) {
            return to_route('myReservations');
        }

/*         if ($request->filled('reservation_reference_code') && $request->filled('email')) {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'email' => 'required|email',
                'reservation_reference_code' => 'required',
            ]);

            if ($validator->fails()) {
                if ($request->wantsJson()) {
                    return response()->json(['errors' => $validator->errors()], 422);
                }
                return Inertia::render('CheckReservation')->withErrors($validator);
            }

            $reservation = Reservation::where('reference_code', $request->reservation_reference_code)
                ->where('email', $request->email)
                ->with(['carGroup.photos', 'pickupLocation', 'returnLocation', 'carGroup.brandKey', 'carGroup.modelKey', 'currency'])
                ->first();

            if ($reservation) {
                //\Log::info('Redirecting to reservation tracking URL: ' . $reservation->tracking_url);
                return to_route('reservation.track', ['token' => $reservation->token]);
            }

            return Inertia::render('CheckReservation')->withErrors([
                'email' => 'Reservation not found or email does not match.'
            ]);
        } */

        return Inertia::render('CheckReservation');
    }

    public function guestTrackReservation(Request $request, $reference_code)
    {
        $email = $request->query('email');

        $reservation = Reservation::where('reference_code', $reference_code)
            ->where('email', $email)
            ->with([
                'carGroup.brandKey',
                'carGroup.modelKey',
                'pickupLocation',
                'returnLocation',
                'currency',
                'extras.extraService'
            ])
            ->first();

        if (!$reservation) {
            return inertia('CheckReservation', [
                'errors' => ['email' => 'Rezervasyon bulunamadı veya geçersiz erişim denemesi.']
            ]);
        }

        return inertia('GuestReservationDetails', [
            'reservation' => $reservation
        ]);
    }

    public function checkReservation(Request $request){
        $validated = $request->validate([
            'email' => 'required|email',
            'reservation_reference_code' => 'required',
        ]);

        $res = Reservation::where('reference_code', $validated['reservation_reference_code'])
            ->where('email', $validated['email'])->first();

        if (!$res) {
            return back()->withErrors([
                'email' => 'Reservation not found or email does not match.'
            ]);
        }

        return to_route('reservation.track', ['token' => $res->token]);
    }

  public function guestCancelReservation(Request $request, $id)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'lang' => 'nullable|string|max:5'
        ]);

        $reservation = Reservation::where('id', $id)
            ->where('email', $validated['email'])
            ->firstOrFail();

        if ($reservation->status !== 'pending') {
            $msg = 'Sadece beklemedeki rezervasyonlar iptal edilebilir.';
            return $request->wantsJson()
                ? response()->json(['message' => $msg, 'status' => 'error'], 422)
                : back()->with('error', $msg);
        }

        $reservation->status = 'cancelled';
        $reservation->save();

        $reservation->load(['carGroup.brandKey', 'carGroup.modelKey', 'pickupLocation', 'returnLocation', 'currency']);
        $langCode = $validated['lang'] ?? app()->getLocale() ?? 'en';
        $lang = \App\Models\Language::where('code', $langCode)->first();
        $lang_id = $lang ? $lang->id : 1;

        $brandName = Translation::where('language_id', $lang_id)
            ->where('translation_key_id', $reservation->carGroup->brandKey->id)
            ->value('value');

        $modelName = Translation::where('language_id', $lang_id)
            ->where('translation_key_id', $reservation->carGroup->modelKey->id)
            ->value('value');

        $reservation->notify(new \App\Notifications\CustomEmailNotification('reservation_decline', [
            'user_name' => $reservation->name,
            'reference_code' => $reservation->reference_code,
            'car_name' => $brandName . ' ' . $modelName,
            'pickup_location' => $reservation->pickupLocation->name,
            'return_location' => $reservation->returnLocation->name,
            'pickup_date' => $reservation->pickup_datetime->setTimezone('Europe/Istanbul')->format('d.m.Y H:i'),
            'return_date' => $reservation->return_datetime->setTimezone('Europe/Istanbul')->format('d.m.Y H:i'),
            'total_price' => number_format($reservation->total_price * $reservation->exchange_rate, 2, ',', '.') . ' ' . $reservation->currency->symbol,
            'lang' => $langCode
        ]));

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Rezervasyon başarıyla iptal edildi.',
                'status' => 'success',
                'reservation_status' => 'cancelled'
            ]);
        }

        return back()->with('success', 'Rezervasyon başarıyla iptal edildi.');
    }

    public function getAvailableCarsForReservation($id)
    {
        $reservation = Reservation::with('carGroup')->findOrFail($id);

        $cars = Car::where('car_group_id', $reservation->car_group_id)
            ->where('status', 'available')
            ->get();

        return response()->json(['cars' => $cars]);
    }

    public function startRental(Request $request, $id)
    {
        $reservation = Reservation::with('carGroup')->findOrFail($id);

        if ($reservation->status !== 'confirmed') {
            return response()->json(['error' => 'Cannot start rental for this reservation.'], 422);
        }

        $request->validate([
            'car_id' => 'required|exists:cars,id'
        ]);

        $car = Car::findOrFail($request->car_id);

        if ($car->car_group_id !== $reservation->car_group_id) {
            return response()->json(['error' => 'Selected car does not belong to the reservation car group.'], 422);
        }

        if ($car->status !== 'available') {
            return response()->json(['error' => 'Selected car is not available.'], 422);
        }

        $reservation->assigned_vehicle_id = $car->id;
        $reservation->status = 'active';
        $reservation->save();

        $car->status = 'rented';
        $car->current_location_id = $reservation->pickup_location_id;
        $car->save();

        return response()->json(['success' => 'Rental started successfully.', 'data' => $reservation]);
    }

    public function completeRental(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        if ($reservation->status !== 'active') {
            return response()->json(['error' => 'Cannot complete rental for an inactive reservation.'], 422);
        }

        $request->validate([
            'current_km' => 'required|integer|min:0'
        ]);

        $reservation->status = 'completed';
        $reservation->save();

        if ($reservation->assigned_vehicle_id) {
            $car = Car::find($reservation->assigned_vehicle_id);
            if ($car) {
                $car->status = 'available';
                $car->current_location_id = $reservation->return_location_id;
                $car->current_km = $request->current_km;
                $car->save();
            }
        }

        return response()->json(['success' => 'Rental completed successfully.', 'data' => $reservation]);
    }

    public function track($token)
    {
        $reservation = Reservation::where('token', $token)
            ->with(['carGroup.photos', 'pickupLocation', 'returnLocation', 'carGroup.brandKey', 'carGroup.modelKey', 'currency', 'extras.extra'])
            ->firstOrFail();

        return inertia('GuestReservationDetails', [
            'reservation' => $reservation
        ]);
    }
}
