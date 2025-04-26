<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\LocationsController;

Route::inertia('/', 'Home')->name('home');
Route::get('/cars', [CarController::class, 'show'])->name('cars');
Route::inertia('/locations', 'Locations')->name('locations');
Route::inertia('/campaigns', 'Campaigns')->name('campaigns');
Route::inertia('/carporateRental', 'CorporateRental')->name('carporateRental');
Route::inertia('/about', 'About')->name('about');
Route::inertia('/blog', 'Blog')->name('blog');
Route::inertia('/auth', 'auth/Auth')->name('auth');

Route::post('/auth', [AuthController::class, 'auth'])->name('auth');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::post('/searchReservation', [AuthController::class, 'deneme'])->name('searchReservation');

Route::get('/location', [LocationsController::class, 'index']);