<?php

namespace App\Http\Controllers;

use App\Models\CarGroup;
use App\Models\Currency;
use App\Models\Language;
use App\Models\Locations;
use App\Models\Photo;
use App\Models\Price;
use App\Models\Translation;
use App\Models\TranslationKey;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminCarController extends Controller
{
    public function showAllCarGroups()
    {
        $cars = CarGroup::with(['cars:id,car_group_id,plate_number,exact_year'])->orderBy('sort_order', 'asc')->get();

        return Inertia::render('adminPanel/cars/CarGroups', [
            'cars' => $cars,
        ]);
    }

    public function showIndexGroup($id)
    {
        return Inertia::render('adminPanel/cars/CarGroup', [
            'id' => $id,
            'locations' => Locations::where('is_active', true)->select('id', 'name')->get(),
        ]);
    }

    public function showAddCarGroup()
    {
        return Inertia::render('adminPanel/cars/AddCarGroup', [
            'locations' => Locations::where('is_active', true)->select('id', 'name')->get(),
        ]);
    }

    public function showAddCar()
    {
        $carGroups = CarGroup::orderBy('sort_order')->get(['id', 'name', 'sort_order']);
        return Inertia::render('adminPanel/cars/AddCar', [
            'carGroups' => $carGroups,
            'languages' => getActiveLanguages(),
            'locations' => Locations::where('is_active', true)->select('id', 'name')->get(),
        ]);
    }

    public function showAllCars()
    {
        $cars = \App\Models\Car::with([
            'carGroup:id,name',
            'currentLocation:id,name',
        ])->orderBy('car_group_id')->orderBy('plate_number')->get();
        return Inertia::render('adminPanel/cars/Cars', [
            'cars' => $cars,
        ]);
    }

    public function showIndexCar($id)
    {
        return Inertia::render('adminPanel/cars/IndexCar', [
            'id' => $id,
            'locations' => Locations::where('is_active', true)->select('id', 'name')->get(),
            'carGroups' => CarGroup::orderBy('sort_order')->get(['id', 'name', 'sort_order']),
            'languages' => Language::select('id', 'code', 'name')->get(),
        ]);
    }

    public function getCarInfo($id)
    {
        $car = Car::with([
            'carGroup:id,name',
            'currentLocation:id,name',
            'brandKey.translations.language',
            'modelKey.translations.language',
            'reservations' => function ($q) {
                $q->with(['carGroup:id,name', 'pickupLocation:id,name', 'returnLocation:id,name'])
                  ->orderBy('pickup_datetime', 'desc');
            },
        ])->findOrFail($id);

        // Parse brand and model translations into language-keyed objects
        $brand = [];
        $model = [];
        
        if ($car->brandKey && $car->brandKey->translations) {
            foreach ($car->brandKey->translations as $t) {
                if ($t->language) {
                    $brand[$t->language->code] = $t->value;
                }
            }
        }
        
        if ($car->modelKey && $car->modelKey->translations) {
            foreach ($car->modelKey->translations as $t) {
                if ($t->language) {
                    $model[$t->language->code] = $t->value;
                }
            }
        }

        return response()->json([
            'car' => $car,
            'brand' => $brand,
            'model' => $model,
        ]);
    }

    public function updateCar(Request $request, $id)
    {
        $validated = $request->validate([
            'plate_number' => 'required|string|max:50',
            'exact_year' => 'nullable|integer|min:1990|max:' . (date('Y') + 1),
            'current_km' => 'nullable|integer|min:0',
            'status' => 'required|in:available,rented,unavailable,maintenance',
            'current_location_id' => 'nullable|exists:locations,id',
            'car_group_id' => 'nullable|exists:car_groups,id',
            'brand' => 'nullable|json',
            'model' => 'nullable|json',
        ]);

        try {
            DB::beginTransaction();
            
            $car = Car::findOrFail($id);
            
            $car->update([
                'plate_number' => $validated['plate_number'],
                'exact_year' => $validated['exact_year'] ?? null,
                'current_km' => $validated['current_km'] ?? null,
                'status' => $validated['status'],
                'current_location_id' => $validated['current_location_id'] ?? null,
                'car_group_id' => $validated['car_group_id'] ?? $car->car_group_id,
            ]);

            // Update brand translations if provided
            if (!empty($validated['brand'])) {
                $brandData = json_decode($validated['brand'], true);
                if ($car->brand_translation_key_id && $brandData) {
                    foreach ($brandData as $langCode => $value) {
                        $lang = Language::where('code', $langCode)->first();
                        if ($lang) {
                            Translation::updateOrCreate(
                                [
                                    'translation_key_id' => $car->brand_translation_key_id,
                                    'language_id' => $lang->id,
                                ],
                                ['value' => $value]
                            );
                        }
                    }
                }
            }

            // Update model translations if provided
            if (!empty($validated['model'])) {
                $modelData = json_decode($validated['model'], true);
                if ($car->model_translation_key_id && $modelData) {
                    foreach ($modelData as $langCode => $value) {
                        $lang = Language::where('code', $langCode)->first();
                        if ($lang) {
                            Translation::updateOrCreate(
                                [
                                    'translation_key_id' => $car->model_translation_key_id,
                                    'language_id' => $lang->id,
                                ],
                                ['value' => $value]
                            );
                        }
                    }
                }
            }

            DB::commit();
            
            $car->load(['carGroup:id,name', 'currentLocation:id,name', 'brandKey.translations.language', 'modelKey.translations.language', 'reservations']);

            $brand = [];
            $model = [];
            if ($car->brandKey && $car->brandKey->translations) {
                foreach ($car->brandKey->translations as $t) {
                    if ($t->language) $brand[$t->language->code] = $t->value;
                }
            }
            if ($car->modelKey && $car->modelKey->translations) {
                foreach ($car->modelKey->translations as $t) {
                    if ($t->language) $model[$t->language->code] = $t->value;
                }
            }

            return response()->json([
                'car' => $car,
                'brand' => $brand,
                'model' => $model,
                'success' => 'Araç başarıyla güncellendi.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Update car failed: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteCar($id)
    {
        $car = Car::findOrFail($id);

        // Check if car has active reservations
        $activeReservations = $car->reservations()
            ->whereIn('status', ['pending', 'confirmed', 'active'])
            ->count();

        if ($activeReservations > 0) {
            return response()->json([
                'error' => 'Bu araca ait aktif rezervasyonlar bulunduğundan silinemez.',
            ], 422);
        }

        $car->delete();

        return response()->json([
            'success' => 'Araç başarıyla silindi.',
        ]);
    }

    public function storeCarGroup(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|json',
            'segment' => 'required|integer|exists:segments,id',
            'body_type' => 'required|integer|exists:body_types,id',
            'seat_count' => 'required|integer|min:1|max:20',
            'trunk_capacity' => 'required|integer|min:0|max:10000',
            'fuel_type' => 'required|integer|exists:fuels,id',
            'transmission_type' => 'required|integer|exists:transmissions,id',
            'currency' => 'required|string|exists:currencies,id',
            'deposit' => 'required|numeric|min:0',
            'price' => 'required|json',
            'photos' => 'required|array|min:1|max:10',
            'photos.*' => 'mimes:jpeg,jpg,png,gif,bmp,webp|max:10240',
            'coverIndex' => 'required|integer|min:0',
        ]);

        try {
            $selectedCurrency = Currency::findOrFail($validated['currency']);
            $rate = $selectedCurrency->exchange_rate;
            $firstLocation = Locations::where('is_active', true)->value('id') ?? 1;

            DB::beginTransaction();

            $group = CarGroup::create([
                'segment_id' => (int) $validated['segment'],
                'body_type_id' => (int) $validated['body_type'],
                'seat_count' => (int) $validated['seat_count'],
                'trunk_capacity' => (int) $validated['trunk_capacity'],
                'fuel_id' => (int) $validated['fuel_type'],
                'transmission_id' => (int) $validated['transmission_type'],
                'deposit' => $validated['deposit'],
                'currency_id' => $validated['currency'],
                'sort_order' => CarGroup::max('sort_order') + 1,
                'name' =>  $validated['name'],
            ]);

            $price = json_decode($validated['price'], true);
            foreach ($price as $month => $dayRanges) {
                foreach ($dayRanges as $dayRange => $priceValue) {
                    $minDay = 0;
                    $maxDay = 0;
                    if (str_contains($dayRange, '+')) {
                        $minDay = (int) str_replace('+', '', $dayRange);
                        $maxDay = 9999;
                    } else {
                        $parts = explode('-', $dayRange);
                        if (count($parts) === 2) {
                            $minDay = (int) $parts[0];
                            $maxDay = (int) $parts[1];
                        } else {
                            continue;
                        }
                    }
                    Price::create([
                        'car_group_id' => $group->id,
                        'month' => (string) $month,
                        'min_days' => $minDay,
                        'max_days' => $maxDay,
                        'currency_id' => $validated['currency'],
                        'price' => $priceValue,
                        'base_price' => (float) $priceValue / $rate,
                        'is_active' => true,
                    ]);
                }
            }

            foreach ($validated['photos'] as $index => $photo) {
                $path = $photo->store('carPhotos', 'public');
                Photo::create([
                    'car_group_id' => $group->id,
                    'photo_path' => $path,
                    'is_cover' => (int) $index === (int) $validated['coverIndex'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'car_group' => $group->fresh(['photos', 'cars']),
                'redirect_id' => $group->id,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Store car group failed: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function storeVehicle(Request $request, int $id)
    {
        $group = CarGroup::findOrFail($id);
        $validated = $request->validate([
            'plate_number' => 'required|string|max:50',
            'exact_year' => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'current_location_id' => 'required|exists:locations,id',
            'current_km' => 'nullable|integer|min:0',
            'status' => 'nullable|in:available,rented,maintenance',
        ]);

        $vehicle = $group->vehicles()->create([
            'plate_number' => $validated['plate_number'],
            'exact_year' => $validated['exact_year'],
            'current_location_id' => $validated['current_location_id'],
            'current_km' => $validated['current_km'] ?? null,
            'status' => $validated['status'] ?? 'available',
        ]);

        return response()->json([
            'success' => true,
            'vehicle' => $vehicle,
            'message' => 'Vehicle added successfully.',
        ]);
    }

    public function updateCarGroup(Request $request, $id)
    {
        $mode = $request->input('mode');
        if ($mode === 'pricing') {
            return $this->updatePrice($request, (int) $id);
        }
        if ($mode === 'edit') {
            return $this->updateDetail($request, (int) $id);
        }
        if ($mode === 'photo') {
            return $this->updatePhoto($request, (int) $id);
        }
        return Inertia::render('adminPanel/cars/CarGroup', ['error' => 'Geçersiz işlem türü.']);
    }

    public function updatePrice(Request $request, int $id)
    {
        $validated = $request->validate([
            'price' => 'required|json',
            'currency' => 'required|integer|exists:currencies,id',
            'deposit' => 'required|numeric|min:0',
        ]);

        try {
            $selectedCurrency = Currency::findOrFail($validated['currency']);
            $rate = $selectedCurrency->exchange_rate;
            DB::beginTransaction();

            $car = CarGroup::with(['photos', 'brandKey', 'modelKey', 'price' => fn ($query) => $query->where('is_active', true)])->findOrFail($id);

            $car->price()->update(['is_active' => false]);
            $car->update(['deposit' => $validated['deposit']]);

            $prices = json_decode($validated['price'], true);
            foreach ($prices as $item => $day_price_array) {
                foreach ($day_price_array as $day_range => $priceValue) {
                    $minDayVal = 0;
                    $maxDayVal = 0;
                    if (str_contains($day_range, '+')) {
                        $minDayVal = (int) str_replace('+', '', $day_range);
                        $maxDayVal = 9999;
                    } else {
                        $rangeParts = explode('-', $day_range);
                        if (count($rangeParts) === 2) {
                            $minDayVal = (int) $rangeParts[0];
                            $maxDayVal = (int) $rangeParts[1];
                        } else {
                            continue;
                        }
                    }
                    Price::create([
                        'car_group_id' => $car->id,
                        'month' => $item,
                        'min_days' => $minDayVal,
                        'max_days' => $maxDayVal,
                        'currency_id' => $validated['currency'],
                        'price' => $priceValue,
                        'base_price' => (float) $priceValue / $rate,
                        'is_active' => true,
                    ]);
                }
            }
            $car->update(['currency_id' => $validated['currency']]);

            DB::commit();
            $updatedCar = CarGroup::with(['photos', 'brandKey', 'modelKey', 'price' => fn ($query) => $query->where('is_active', true)])->findOrFail($id);

            return response()->json([
                'car' => $updatedCar,
                'success' => 'Araç fiyatı başarıyla güncellendi.',
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            Log::info('Araç Fİyat GÜncellemesi Olumsuz', ['error' => $exception->getMessage()]);
            return response()->json([
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    public function updateDetail(Request $request, int $id)
    {
        try {
            $validated = $request->validate([
                'license_plate' => 'nullable|string|max:20',
                'brand' => 'required|json',
                'model' => 'required|json',
                'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
                'seat_count' => 'required|integer|min:1|max:20',
                'trunk_capacity' => 'required|integer|min:0|max:10000',
                'segment' => 'required|integer|exists:segments,id',
                'body_type' => 'required|integer|exists:body_types,id',
                'transmission_type' => 'required|integer|exists:transmissions,id',
                'fuel_type' => 'required|integer|exists:fuels,id',
            ]);

            $car = CarGroup::with(['brandKey', 'modelKey'])->findOrFail($id);

            foreach (json_decode($validated['brand'], true) as $key => $value) {
                Translation::where('translation_key_id', $car->brandKey->id)
                    ->where('language_id', Language::where('code', $key)->first()->id)
                    ->update(['value' => $value]);
            }
            foreach (json_decode($validated['model'], true) as $key => $value) {
                Translation::where('translation_key_id', $car->modelKey->id)
                    ->where('language_id', Language::where('code', $key)->first()->id)
                    ->update(['value' => $value]);
            }

            $car->update([
                'segment_id' => (int) $validated['segment'],
                'seat_count' => (int) $validated['seat_count'],
                'trunk_capacity' => (int) $validated['trunk_capacity'],
                'body_type_id' => (int) $validated['body_type'],
                'transmission_id' => (int) $validated['transmission_type'],
                'fuel_id' => (int) $validated['fuel_type'],
            ]);

            $firstVehicle = $car->vehicles()->first();
            if ($firstVehicle) {
                if (array_key_exists('license_plate', $validated) && $validated['license_plate'] !== null && $validated['license_plate'] !== '') {
                    $firstVehicle->update(['plate_number' => $validated['license_plate']]);
                }
                if (array_key_exists('year', $validated) && $validated['year'] !== null && $validated['year'] !== '') {
                    $firstVehicle->update(['exact_year' => (int) $validated['year']]);
                }
            }

            $updatedCar = CarGroup::with(['photos', 'brandKey', 'modelKey', 'vehicles', 'price' => fn ($query) => $query->where('is_active', true)])->findOrFail($id);

            return response()->json([
                'car' => $updatedCar,
                'success' => 'Araç Detayları Başarıyla Güncellendi.',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'car' => $updatedCar ?? $car ?? null,
                'errors' => $e->errors(),
            ]);
        }
    }

    public function updatePhoto(Request $request, int $id)
    {
        $car = CarGroup::with(['photos', 'discount'])->findOrFail($id);

        $existingPhotos = $request->input('existing_photos', []);
        $newPhotos = $request->file('photos', []);

        if (empty($existingPhotos) && empty($newPhotos)) {
            return Inertia::render('adminPanel/cars/CarGroup', [
                'car' => $car,
                'error' => 'En az bir fotoğraf yüklemelisiniz.',
            ]);
        }

        $existingPhotoPaths = array_filter($existingPhotos);

        $car->photos()->whereNotIn('photo_path', $existingPhotoPaths)->get()->each(function ($photo) {
            Storage::disk('public')->delete($photo->photo_path);
            $photo->delete();
        });

        foreach ($newPhotos as $photo) {
            if ($photo) {
                $path = $photo->store('carPhotos', 'public');
                Photo::create([
                    'car_group_id' => $car->id,
                    'photo_path' => $path,
                    'is_cover' => false,
                ]);
            }
        }

        if ($request->has('coverIndex')) {
            $coverIndex = (int) $request->input('coverIndex');
            $allPhotos = $car->photos()->get();
            foreach ($allPhotos as $index => $photo) {
                $photo->is_cover = ($index === $coverIndex);
                $photo->save();
            }
        } else {
            $first = $car->photos()->first();
            if ($first && !$first->is_cover) {
                $first->is_cover = true;
                $first->save();
            }
        }

        $updatedCar = CarGroup::with(['photos'])->findOrFail($id);

        return response()->json(['car' => $updatedCar]);
    }

    public function updateSortOrder(Request $request)
    {
        $validated = $request->validate([
            'cars' => 'required|array',
            'cars.*.id' => 'required|integer|exists:car_groups,id',
            'cars.*.sort_order' => 'required|integer',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                foreach ($validated['cars'] as $carData) {
                    CarGroup::where('id', $carData['id'])
                        ->update(['sort_order' => $carData['sort_order']]);
                }
            });

            return response()->json(['success' => true, 'message' => 'CarGroup order updated successfully']);
        } catch (\Exception $e) {
            Log::error('Sort Order Update Failed', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Database error'], 500);
        }
    }
}
