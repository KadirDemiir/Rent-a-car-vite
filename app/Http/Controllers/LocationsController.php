<?php

namespace App\Http\Controllers;

use App\Models\Locations;
use Illuminate\Http\Request;

class LocationsController extends Controller
{

    public function index(Request $request)
    {
        $locations = Locations::all();
        return response()->json(['locations' => $locations]);
    }
}
