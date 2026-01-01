<?php

namespace App\Http\Controllers;

use App\Models\Locations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LocationsController extends Controller
{

    public function index(Request $request)
    {
        $locations = Locations::all();
        return response()->json(['locations' => $locations]);
    }

    public function getIndexLocationInfo($id)
    {
        $location = Locations::with(['cars.price', 'cars.brandKey', 'cars.modelKey'])->findOrFail($id);
        Log::info($location);
        $locations = Locations::all();
        Log::info($locations);
        return response()->json(['location' => $location, 'locations' => $locations]);
    }


    public function addLocation(Request $request)
    {
        Log::info($request);
        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'city'      => 'required|string|max:100',
            'phone'     => 'required|string|max:20',
            'email'     => 'required|email|max:255',
            'address'   => 'required|string',
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'parentId'  => 'nullable|exists:locations,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasyon hatası oluştu.',
                'errors'  => $validator->errors()
            ], 422);
        }
        if ($request->hasFile('image'))
            $path = $request->file('image')->store('uploads', 'public');
        try {
            $location = new Locations();
            $location->name = $request->name;
            $location->city = $request->city;
            $location->phone = $request->phone;
            $location->email = $request->email;
            $location->address = $request->address;
            $location->latitude = $request->latitude;
            $location->longitude = $request->longitude;
            $location->parent_id = $request->parentId ?: null;
            $location->photo_path = $path;
            $location->save();Log::info(2);
            return response()->json([
                'message' => 'Lokasyon başarıyla kaydedildi.',
                'data'    => $location
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Bir hata oluştu.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function updateLocation(Request $request, $id)
    {
        Log::info("Lokasyon Güncelleme İsteği - ID: " . $id);

        $validator = Validator::make($request->all(), [
            'name'      => 'required|string|max:255',
            'city'      => 'required|string|max:100',
            'phone'     => 'required|string|max:20',
            'email'     => 'required|email|max:255',
            'address'   => 'required|string',
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
            'parentId'  => 'nullable|exists:locations,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasyon hatası oluştu.',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $location = Locations::findOrFail($id);

            if ($request->hasFile('image')) {
                if ($location->photo_path && Storage::disk('public')->exists($location->photo_path)) {
                    Storage::disk('public')->delete($location->photo_path);
                }
                $path = $request->file('image')->store('uploads', 'public');
                $location->photo_path = $path;
            }

            $location->name = $request->name;
            $location->city = $request->city;
            $location->phone = $request->phone;
            $location->email = $request->email;
            $location->address = $request->address;
            $location->latitude = $request->latitude;
            $location->longitude = $request->longitude;
            $location->parent_id = $request->parentId ?: null;
            $location->save();

            return response()->json([
                'message' => 'Lokasyon başarıyla güncellendi.',
                'data'    => $location
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Güncellenmek istenen lokasyon bulunamadı.',
            ], 404);
        } catch (\Exception $e) {
            Log::error("Güncelleme hatası: " . $e->getMessage());
            return response()->json([
                'message' => 'Bir hata oluştu.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
