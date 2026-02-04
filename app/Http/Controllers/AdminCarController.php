<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Currency;
use App\Models\Language;
use App\Models\Photo;
use App\Models\Price;
use App\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use function Laravel\Prompts\error;

class AdminCarController extends Controller
{
    public function showAll()
    {
        $cars = Car::with(['brandKey:id,key', 'modelKey:id,key'])->orderBy('sort_order', 'asc')->get();

        return Inertia::render('adminPanel/cars/Cars', [
            'cars' => $cars
        ]);
    }

    public function showIndex($id)
    {
        return Inertia::render('adminPanel/cars/Car', ['id' => $id]);
    }

    public function updateCar(Request $request, $id)
    {
        $mode = $request->input('mode');
        if ($mode == "pricing") {
            return $this->updatePrice($request, $id);
        } elseif ($mode == "edit") {
            return $this->updateDetail($request, $id);
        } elseif ($mode == "photo") {
            return $this->updatePhoto($request, $id);
        } else {
            return Inertia::render('adminPanel/cars/Car', ['error' => 'Geçersiz işlem türü.']);
        }
    }

    public function updatePrice(Request $request, int $id)
    {
        $validated = $request->validate([
            'price' => 'required|json',
            'currency' => 'required|int|exists:currencies,id',
            'deposit' => 'required|numeric|min:0',
        ]);
        Log::info(2);
        try {
            $selectedCurrency = Currency::findOrFail($validated['currency']);
            $rate = $selectedCurrency->exchange_rate;
            DB::beginTransaction();
            $car = Car::with(['photos', 'brandKey', 'modelKey', 'price' => fn($query) => $query->where('is_active', true)])->findOrFail($id);

            $car->price()->update(['is_active' => false]);
            $car->update([
                'deposit' => $validated['deposit'],
            ]);
            $prices = json_decode($validated['price'], true);
            foreach ($prices as $item => $day_price_array) {
                foreach ($day_price_array as $day_range => $priceValue) {
                    $minDayVal = 0;
                    $maxDayVal = 0;
                    if (str_contains($day_range, '+')) {
                        $minDayVal = (int)str_replace('+', '', $day_range);
                        $maxDayVal = 9999;
                    } else {
                        $rangeParts = explode('-', $day_range);
                        if (count($rangeParts) === 2) {
                            $minDayVal = (int)$rangeParts[0];
                            $maxDayVal = (int)$rangeParts[1];
                        } else
                            continue;
                    }
                    $pricee = Price::create([
                        'car_id' => $car->id,
                        'month' => $item,
                        'min_days' => $minDayVal,
                        'max_days' => $maxDayVal,
                        'currency_id' => $validated['currency'],
                        'price' => $priceValue,
                        'base_price' => (float) $priceValue / $rate,
                        'is_active' => true,
                    ]);

                    /*Log::info('Price-Control', ['price' => $pricee]);*/
                }
            }
            $car->update([
                'currency_id' => $validated['currency'],
            ]);
            DB::commit();
            $updatedCar = Car::with(['photos', 'brandKey', 'modelKey', 'price' => fn($query) => $query->where('is_active', true)])->findOrFail($id);
            Log::info('Araç Fİyat GÜncellemesi Olumlu', ['car' => $updatedCar->price->toArray()]);
            return response()->json([
                'car' => $updatedCar,
                'success' => 'Araç fiyatı başarıyla güncellendi.'
            ]);
        }catch (\Exception $exception){
            DB::rollBack();
            Log::info('Araç Fİyat GÜncellemesi Olumsuz', ['error' => $exception->getMessage()]);
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function updateDetail(Request $request, int $id)
    {
        Log::info('All Request', ['request' => $request->all()]);
        try {
            $validated = $request->validate([
                'license_plate' => 'required|string|max:20',
                'brand' => 'required|json',
                'model' => 'required|json',
                'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
                'seat_count' => 'required|integer|min:1|max:20',
                'trunk_capacity' => 'required|integer|min:0|max:10000',
                'segment' => 'required|int|exists:segments,id',
                'body_type' => 'required|int|exists:body_types,id',
                'transmission_type' => 'required|int|exists:transmissions,id',
                'fuel_type' => 'required|int|exists:fuels,id',
                'status' => 'required|in:available,rented,unavailable',
            ]);
        Log::info('Kontrol Detay', ['car' => $validated]);
            $car = Car::with(['brandKey', 'modelKey'])->findOrFail($id);

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
            Log::info('Kontrol Detay', ['car fuel   ' => $validated['transmission_type']]);
            $car->update([
                'license_plate' => $validated['license_plate'],
                'year' => (int) $validated['year'],
                'seat_count' => (int) $validated['seat_count'],
                'trunk_capacity' => $validated['trunk_capacity'],
                'segment_id' => (int) $validated['segment'],
                'body_type_id' => (int) $validated['body_type'],
                'transmission_id' => (int) $validated['transmission_type'],
                'fuel_id' => (int) $validated['fuel_type'],
                'status' => $validated['status'],
            ]);
            $updatedCar = Car::with(['photos', 'brandKey', 'modelKey', 'price' => fn($query) => $query->where('is_active', true)])->findOrFail($id);
            Log::info('Car Detail Control', ['car_fuel' => $car->transmission_id]);
            return response()->json([
                'car' => $updatedCar,
                'success' => 'Araç Detayları Başarıyla Güncellendi.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'car' => $updatedCar ?? $car,
                'errors' => $e->errors()
            ]);
        }
    }

    public function updatePhoto(Request $request, int $id)
    {
        $car = Car::with(['photos', 'discount'])->findOrFail($id);

        $existingPhotos = $request->input('existing_photos', []);
        $newPhotos = $request->file('photos', []);

        if (empty($existingPhotos) && empty($newPhotos)) {
            return Inertia::render('adminPanel/cars/Car', [
                'car' => $car,
                'error' => 'En az bir fotoğraf yüklemelisiniz.'
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
                    'car_id' => $car->id,
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
        $updatedCar = Car::with(['photos'])->findOrFail($id);

        return response()->json( ['car' => $updatedCar,]);
    }

    public function updateSortOrder(Request $request)
    {
        Log::info('Update Sort Order Request', ['request' => $request->all()]);
        $validated = $request->validate([
            'cars' => 'required|array',
            'cars.*.id' => 'required|integer|exists:cars,id',
            'cars.*.sort_order' => 'required|integer'
        ]);

        try {
            DB::transaction(function () use ($validated) {
                foreach ($validated['cars'] as $carData) {
                    Car::where('id', $carData['id'])
                        ->update(['sort_order' => $carData['sort_order']]);
                }
            });

            return response()->json(['success' => true, 'message' => 'Car order updated successfully']);

        } catch (\Exception $e) {
            Log::error('Sort Order Update Failed', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Database error'], 500);
        }
    }
}
