<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\SignInController;
use App\Http\Controllers\AuthController;

Route::inertia('/', 'Home')->name('home');
Route::inertia('/cars', 'Cars')->name('cars');
Route::inertia('/locations', 'Locations')->name('locations');
Route::inertia('/campaigns', 'Campaigns')->name('campaigns');
Route::inertia('/carporateRental', 'CorporateRental')->name('carporateRental');
Route::inertia('/about', 'About')->name('about');
Route::inertia('/blog', 'Blog')->name('blog');
Route::inertia('/auth', 'auth/Auth')->name('auth');

Route::post('/auth', [AuthController::class, 'auth'])->name('auth');