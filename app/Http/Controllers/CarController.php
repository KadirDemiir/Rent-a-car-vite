<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarController extends Controller
{
    public function show(){
        $cars = Car::all();
        return Inertia::render('Cars', [
            'cars' => $cars
        ]);
    }
} 
