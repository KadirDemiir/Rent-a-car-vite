<?php

namespace App\Http\Controllers;

use App\Models\CarGroup;
use App\Models\Currency;
use App\Models\InternalService;
use App\Models\Language;
use App\Models\Locations;
use App\Models\Photo;
use App\Models\Price;
use App\Models\Translation;
use App\Models\TranslationKey;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CarController extends Controller
{
    public function showAllCars()
    {
        $cars = CarGroup::select([
            'id',
            'name',
            'segment_id',
            'body_type_id',
            'transmission_id',
            'fuel_id',
            'seat_count',
            'trunk_capacity',
            'deposit',
            'sort_order',
        ])
            ->with([
                'photos:id,car_group_id,photo_path,is_cover',
            ])
            ->orderBy('sort_order', 'asc')
            ->get();

        return Inertia::render('Cars', [
            'cars' => $cars,
            'locations' => Locations::where('is_active', true)->select(['id', 'name'])->get(),
        ]);
    }

    public function showCar($id)
    {
        $car = CarGroup::where('id', $id)->with(['photos'])->firstOrFail();
        $internalServices = InternalService::all();
        return Inertia::render('CarIndex', [
            'car' => $car,
            'internalServices' => $internalServices,
        ]);
    }

    public function addCar(Request $request)
    {
        $validated = $request->validateWithBag('err', [
            'plate_number' => 'required|string|max:255|',
            'brand' => 'required|json',
            'model' => 'required|json',
            'exact_year' => 'required|integer',
            'car_group_id' => 'required|integer|exists:car_groups,id',
            'status' => 'required|string',
            'current_location_id' => 'required|integer|exists:locations,id',
            'current_km' => 'required|integer',

        ]);

        try {
            DB::beginTransaction();

            $brandTranslationKey = TranslationKey::create([
                'key' => 'car.brand.' . Str::uuid(),
                'description' => 'car brand name',
            ]);
            $modelTranslationKey = TranslationKey::create([
                'key' => 'car.model.' . Str::uuid(),
                'description' => 'car model name',
            ]);
            $brandName = json_decode($validated['brand'], true);
            $modelName = json_decode($validated['model'], true);

            foreach ($brandName as $brand => $value) {
                $lang_id = Language::where('code', $brand)->first()->id;
                Translation::create([
                    'language_id' => $lang_id,
                    'translation_key_id' => $brandTranslationKey->id,
                    'value' => $value,
                ]);
            }
            foreach ($modelName as $model => $value) {
                $lang_id = Language::where('code', $model)->first()->id;
                Translation::create([
                    'language_id' => $lang_id,
                    'translation_key_id' => $modelTranslationKey->id,
                    'value' => $value,
                ]);
            }


            \App\Models\Car::create([
                'car_group_id' => $validated['car_group_id'],
                'plate_number' => $validated['plate_number'],
                'exact_year' => (int) $validated['exact_year'],
                'status' => $validated['status'],
                'current_location_id' => $validated['current_location_id'],
                'location_id' => $validated['current_location_id'],
                'brand_translation_key_id' => $brandTranslationKey->id,
                'model_translation_key_id' => $modelTranslationKey->id,
                'current_km' => $validated['current_km'],
            ]);
            DB::commit();

            return response()->json([
                'success' => true,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Hata oluştu: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
