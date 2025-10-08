<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Discount;
use App\Models\Photo;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class  CarController extends Controller
{
    public function showAllCars(){
        session(['lang' => 'a']);
        App::setLocale(session('lang'));
        $cars = Car::with('photos')->get();
        return Inertia::render('Cars', [
            'cars' => $cars
        ]);
    }

    public function showCar($id){
        $car = Car::where('id', $id)->with('photos')->first();
        return Inertia::render('CarIndex', [
            'car' => $car
        ]);
    }
    public function addCar(Request $request){
        Log::info('car', ['car' => $request->all()]);
        $validated = $request->validate([
            'license_plate' => 'required|unique:cars|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|int',
            'seat_count' => 'required|int',
            'trunk_capacity' => 'required|int',
            'segment' => 'required|string|max:255',
            'body_type' => 'required|exists:body_types,id',
            'fuel_type' => 'required|string|max:255',
            'transmission_type' => 'required|string|max:255',
            'deposit_currency' => 'required|string|max:3',
            'price_currency' => 'required|string|max:3',
            'deposit' => 'required|int',
            'price' => 'required|int',
            'hasDiscount' => 'required|int',
            'dayDiscount' => 'json',
            'start_date' => 'date',
            'end_date' => 'date',
            'photos' => 'required|array|min:1|max:4',
            'photos.*' => 'mimes:jpeg,jpg,png,gif|max:10240',
            'coverIndex' => 'required|int',
        ]);
        try {
            DB::beginTransaction();
            $newCar = new Car();
            $newCar->location_id = 1;
            $newCar->license_plate = $validated['license_plate'];
            $newCar->brand = $validated['brand'];
            $newCar->model = $validated['model'];
            $newCar->year = $validated['year'];
            $newCar->segment = $validated['segment'];
            $newCar->body_type = $validated['body_type'];
            $newCar->seat_count  = $validated['seat_count'];
            $newCar->trunk_capacity = $validated['trunk_capacity'];
            $newCar->fuel_type = $validated['fuel_type'];
            $newCar->transmission_type = $validated['transmission_type'];
            $newCar->price = $validated['price'];
            $newCar->price_currency  = $validated['price_currency'];
            $newCar->deposit = $validated['deposit'];
            $newCar->deposit_currency  = $validated['deposit_currency'];
            $newCar->save();
            $discounts = json_decode($validated['dayDiscount'], true);
            if ($validated['hasDiscount']){
                $now = Carbon::now();
                foreach ($discounts as $item) {
                    $nd = new Discount();
                    $nd->discount_type = $item['discount_type'];
                    $nd->discount_value = $item['discount_amount'];
                    $nd->currency = $item['currency'];
                    $nd->target_type = "car";
                    $nd->min_days = $item['min_day'];
                    $nd->max_days = $item['max_day'];
                    $nd->car_id = $newCar->id;
                    $nd->start_date = $validated['start_date'];
                    $nd->end_date = $validated['end_date'];
                    if ($now->between($validated['start_date'], $validated['end_date']))
                        $nd->status = 'active';
                    else
                        $nd->status = 'inactive';
                    $nd->save();
                }
            }

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
