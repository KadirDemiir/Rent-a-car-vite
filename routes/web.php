<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CampaignsController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\LocationsController;
use App\Http\Controllers\ReservationController;
use App\Models\Reservation;

Route::inertia('/', 'Home')->name('home');
Route::get('/cars', [CarController::class, 'showAllCars'])->name('cars');
Route::get('/cars/{id}', [CarController::class, 'showCar'])->name('car');
Route::inertia('/locations', 'Locations')->name('locations');
Route::get('/campaigns', [CampaignsController::class, 'showAll'])->name('allCampaigns');
Route::get('/campaigns/{id}', [CampaignsController::class, 'showIndex'])->name('showCampaign');
Route::inertia('/carporateRental', 'CorporateRental')->name('carporateRental');
Route::inertia('/about', 'About')->name('about');
Route::inertia('/blog', 'Blog')->name('blog');
Route::inertia('/auth', 'auth/Auth')->name('auth');
Route::get('/searchReservations', [ReservationController::class, 'searchReservations'])->name('searchReservations');

Route::post('/auth', [AuthController::class, 'auth'])->name('auth');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

//Route::post('/searchReservations', [ReservationController::class, 'searchReservations'])->name('searchReservations');

Route::get('/location', [LocationsController::class, 'index']);