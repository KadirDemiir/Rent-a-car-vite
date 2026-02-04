<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Currency;
use App\Models\Discount;
use App\Models\InternalService;
use App\Models\Language;
use App\Models\Locations;
use App\Models\Photo;
use App\Models\Price;
use App\Models\Translation;
use App\Models\TranslationKey;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class  CarController extends Controller
{
    public function showAllCars(){
        $cars = Car::with(['photos', 'brandKey', 'modelKey'])->orderBy('sort_order', 'asc')->get();
        return Inertia::render('Cars', [
            'cars' => $cars,
            'locations' => Locations::where('is_active', true)->get(),
        ]);
    }

    public function showCar($id){
        $car = Car::where('id', $id)->with(['photos', 'modelKey', 'brandKey'])->first();
        $internalServices = InternalService::all();
        return Inertia::render('CarIndex', [
            'car' => $car,
            'internalServices' => $internalServices
        ]);
    }
    public function addCar(Request $request){
        Log::info('car', ['car' => $request->all()]);
        $validated = $request->validateWithBag('err',[
            'license_plate' => 'required|unique:cars|max:255',
            'brand' => 'required|json',
            'model' => 'required|json',
            'year' => 'required|int',
            'seat_count' => 'required|int',
            'trunk_capacity' => 'required|int',
            'segment' => 'required|int',
            'body_type' => 'required|exists:body_types,id',
            'fuel_type' => 'required|int',
            'transmission_type' => 'required|int',
            'currency' => 'required|string|max:3',
            'deposit' => 'required|int',
            'price' => 'required|json|',
            'photos' => 'required|array|min:1|max:4',
            'photos.*' => 'mimes:jpeg,jpg,png,gif,bmp,webp|max:10240',
            'coverIndex' => 'required|int',
        ]);
        Log::info('car', ['aşama 1' => 1]);
        try {
            $selectedCurrency = Currency::findOrFail($validated['currency']);
            $rate = $selectedCurrency->exchange_rate;
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
                $lang_id = Language::where('code', $brand)->get()->first()->id;
                Translation::create([
                    'language_id' => $lang_id,
                    'translation_key_id' => $brandTranslationKey->id,
                    'value' => $value,
                ]);
            }
            foreach ($modelName as $model => $value) {
                $lang_id = Language::where('code', $model)->get()->first()->id;
                Translation::create([
                    'language_id' => $lang_id,
                    'translation_key_id' => $modelTranslationKey->id,
                    'value' => $value,
                ]);
            }
            $newCar = new Car();
            $newCar->location_id = 1;
            $newCar->current_location_id = 1;
            $newCar->license_plate = $validated['license_plate'];
            $newCar->brand_translation_key_id = $brandTranslationKey->id;
            $newCar->model_translation_key_id = $modelTranslationKey->id;
            $newCar->year = $validated['year'];
            $newCar->segment_id = (int)$validated['segment'];
            $newCar->body_type_id =(int) $validated['body_type'];
            $newCar->seat_count  = $validated['seat_count'];
            $newCar->trunk_capacity = (int)$validated['trunk_capacity'];
            $newCar->fuel_id = (int)$validated['fuel_type'];
            $newCar->transmission_id = $validated['transmission_type'];
            $newCar->deposit = $validated['deposit'];
            $newCar->currency_id  = $validated['currency'];
            $newCar->save();

            $price = json_decode($validated['price'], true);
            foreach ($price as $item => $day_price_array) {
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
                    Price::create([
                            'car_id' => $newCar->id,
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
            Log::info('car', ['aşama 3' => 2]);
            foreach ($validated['photos'] as $index => $photo) {
                $newPhoto = new Photo();
                $path = $photo->store('carPhotos', 'public');
                $newPhoto->car_id = $newCar->id;
                $newPhoto->photo_path = $path;
                if($index == $validated['coverIndex'])
                    $newPhoto->is_cover = true;
                else
                    $newPhoto->is_cover = false;
                $newPhoto->save();
            }
            DB::commit();

            return response()->json([
                'success' => true,
                'car' => $newCar
            ]);
        }catch (\Exception $e){
            DB::rollBack();
            Log::error('Hata oluştu: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }


    }

}
