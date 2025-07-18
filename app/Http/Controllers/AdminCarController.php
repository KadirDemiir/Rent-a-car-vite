<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminCarController extends Controller
{
    public function showAll()
    {
        $cars = Car::all();

        return Inertia::render('adminPanel/cars/Cars', [
            'cars' => $cars
        ]);
    }

    public function showIndex($id)
    {
        $car = Car::where('id', $id)->with('photos')->with('discount')->first();

        return Inertia::render('adminPanel/cars/Car', ['car' => $car]);
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
            'price' => 'required|numeric|min:0',
            'price_currency' => 'required|string|',
            'deposit' => 'required|numeric|min:0',
            'deposit_currency' => 'required|string|size:3',
        ]);

        $car = Car::with(['photos', 'discount'])->findOrFail($id);
        $car->update([
            'price' => $validated['price'],
            'price_currency' => $validated['price_currency'],
            'deposit' => $validated['deposit'],
            'deposit_currency' => $validated['deposit_currency'],
        ]);

        return Inertia::render('adminPanel/cars/Car', [
            'car' => $car,
            'success' => 'Araç Fiyatı Başarıyla Güncellendi.'
        ]);
    }

    public function updateDetail(Request $request, int $id)
    {
        try {
            $validated = $request->validate([
                'license_plate' => 'required|string|max:20',
                'brand' => 'required|string|max:50',
                'model' => 'required|string|max:50',
                'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
                'seat_count' => 'required|integer|min:1|max:20',
                'trunk_capacity' => 'required|integer|min:0|max:10000',
                'segment' => 'required|string',
                'body_type' => 'required|string',
                'transmission_type' => 'required|string',
                'fuel_type' => 'required|string',
            ]);
            $car = Car::with(['photos', 'discount'])->findOrFail($id);
            $car->update([
                'license_plate' => $validated['license_plate'],
                'brand' => $validated['brand'],
                'model' => $validated['model'],
                'year' => $validated['year'],
                'seat_count' => $validated['seat_count'],
                'trunk_capacity' => $validated['trunk_capacity'],
                'segment' => $validated['segment'],
                'body_type' => $validated['body_type'],
                'transmission_type' => $validated['transmission_type'],
                'fuel_type' => $validated['fuel_type'],
            ]);

            return Inertia::render('adminPanel/cars/Car', [
                'car' => $car,
                'success' => 'Araç Detayları Başarıyla Güncellendi.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return Inertia::render('adminPanel/cars/Car', [
                'car' => $car,
                'errors' => $e->errors()
            ]);
        } catch (\Exception $e) {
            return Inertia::render('adminPanel/cars/Car', [
                'car' => $car,
                'error' => 'Araç güncellenirken bir hata oluştu: ' . $e->getMessage()
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

        return Inertia::render('adminPanel/cars/Car', [
            'car' => $car,
            'success' => 'Fotoğraflar başarıyla güncellendi.'
        ]);
    }
}
