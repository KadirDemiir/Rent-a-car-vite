<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Inertia\Inertia;

class AdminCarController extends Controller{
    public function showAll(){
        $cars = Car::all();

        return Inertia::render('adminPanel/cars/Cars', [
            'cars' => $cars
        ]);
    }

    public function showIndex($id){
        $car = Car::where('id',$id)->first();

        return Inertia::render('adminPanel/cars/Car',['car'=>$car]);
    }
}
