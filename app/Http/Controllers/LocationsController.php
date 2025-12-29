<?php

namespace App\Http\Controllers;

use App\Models\Locations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LocationsController extends Controller
{

    public function index(Request $request)
    {
        $locations = Locations::all();
        return response()->json(['locations' => $locations]);
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
            'parentId'  => 'nullable|exists:locations,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasyon hatası oluştu.',
                'errors'  => $validator->errors()
            ], 422);
        }
        Log::info(1);
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
}
