<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarController extends Controller
{
    public function showAllCars(){
        $cars = Car::all();
        return Inertia::render('Cars', [
            'cars' => $cars
        ]);
    }

    public function showCar($id){
        $car = Car::where('id', $id)->first();
        return Inertia::render('CarIndex', [
            'car' => $car
        ]);
    }
} 
