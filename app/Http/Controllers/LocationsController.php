<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LocationsController extends Controller
{
    protected $Locations = ["Ankara", "İstanbul", "Antalya", "İzmir", "Nevşehir", "Kayseri", "Mersin", "Muğla", "Bursa"];

    public function index(Request $request)
    {
        return response()->json($this->Locations);
    }
}
