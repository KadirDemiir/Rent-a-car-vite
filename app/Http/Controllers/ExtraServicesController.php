<?php

namespace App\Http\Controllers;

use App\Models\ExtraServices;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExtraServicesController extends Controller
{
    public function showAll(){
        $extraServices = ExtraServices::all();
        return Inertia::render('adminPanel/additionalServices/ExtraServices', ['extraServices' => $extraServices]);
    }
}
