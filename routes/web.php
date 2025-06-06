<?php

use App\Http\Controllers\AdminCarController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CampaignsController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\LocationsController;
use App\Http\Controllers\ReservationController;
use App\Models\Reservation;
use Inertia\Inertia;

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

Route::inertia('/adminpanel', 'adminPanel/Home')->name('adminHome');
//Route::inertia('/adminpanel/cars', 'adminPanel/cars/Cars')->name('adminCars ');
Route::get('/adminpanel/cars', [AdminCarController::class, 'showAll'])->name('adminCars');
Route::get('/adminpanel/cars/{id}', [AdminCarController::class, 'showIndex'])->name('adminShowCar');
Route::inertia('/adminpanel/add-car', 'adminPanel/cars/AddCar')->name('adminAddCar ');
Route::inertia('/adminpanel/campaigns', 'adminPanel/campaigns/Campaigns')->name('adminCampaigns ');
Route::inertia('/adminpanel/campaign/add', 'adminPanel/campaigns/AddCampaign')->name('adminAddCampaign ');
Route::inertia('/adminpanel/locations', 'adminPanel/locations/Locations')->name('adminLocations ');
Route::inertia('/adminpanel/add-location', 'adminPanel/locations/AddLocation')->name('adminAddLocation ');
Route::inertia('/adminpanel/reservations', 'adminPanel/reservation/Reservations')->name('adminReservations ');
Route::inertia('/adminpanel/add-reservation', 'adminPanel/reservations/AddReservation')->name('adminAddReservation ');
Route::inertia('/adminpanel/users', 'adminPanel/users/Users')->name('adminUsers ');
Route::inertia('/adminpanel/drop-price', 'adminPanel/price/DropPrice')->name('adminDropPrice ');
Route::inertia('/adminpanel/discounts', 'adminPanel/price/Discounts')->name('adminAddDropPrice ');
Route::inertia('/adminpanel/discount/add', 'adminPanel/price/AddDiscount')->name('adminAddDiscount ');
Route::inertia('/adminpanel/internal-services', 'adminPanel/additionalServices/InternalServices')->name('adminInternalServices ');
Route::inertia('adminpanel/external-services', 'adminPanel/additionalServices/ExtraServices')->name('adminExternalServices ');
