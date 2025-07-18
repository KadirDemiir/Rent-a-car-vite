<?php

use App\Http\Controllers\AdminCarController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CampaignsController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\DropPriceController;
use App\Models\Discount;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarController;
use App\Http\Controllers\LocationsController;
use App\Http\Controllers\ReservationController;
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
Route::post('/adminpanel/cars/{id}', [AdminCarController::class, 'updateCar'])->name('adminUpdateCar');
Route::inertia('/adminpanel/car/add', 'adminPanel/cars/AddCar')->name('adminAddCar ');
Route::post('/adminpanel/car/add', [CarController::class, 'addCar'])->name('adminAddCar');
Route::get('/adminpanel/campaigns', [CampaignsController::class, 'showAllAdminPanel'])->name('showAllCampaignsAdminPanel');
Route::post('/adminpanel/campaigns', [CampaignsController::class, 'deleteCampaign'])->name('adminDeleteCampaign');
Route::get('/adminpanel/campaigns/{id}', [CampaignsController::class, 'showIndexAdminPanel'])->name('showIndexAdminPanel');
Route::post('/adminpanel/campaigns/{id}', [CampaignsController::class, 'updateCampaign'])->name('adminUpdateCampaign');
Route::inertia('/adminpanel/campaign/add', 'adminPanel/campaigns/AddCampaign')->name('adminAddCampaign ');
Route::inertia('/adminpanel/locations', 'adminPanel/locations/Locations')->name('adminLocations ');
Route::inertia('/adminpanel/add-location', 'adminPanel/locations/AddLocation')->name('adminAddLocation ');
Route::inertia('/adminpanel/reservations', 'adminPanel/reservation/Reservations')->name('adminReservations ');
Route::inertia('/adminpanel/add-reservation', 'adminPanel/reservations/AddReservation')->name('adminAddReservation ');
Route::inertia('/adminpanel/users', 'adminPanel/users/Users')->name('adminUsers ');
Route::get('/adminpanel/drop-price', [DropPriceController::class, 'showAdminDropPrice'])->name('adminShowDropPrice');
Route::post('adminpanel/drop-price', [DropPriceController::class, 'addDropPrice'])->name('adminAddDropPrice ');
Route::get('/adminpanel/discounts', function () {
    $discounts = Discount::with('car')->get();

    return Inertia::render('adminPanel/price/Discounts', [
        'data' => $discounts,
    ]);
})->name('adminAddDropPrice');
Route::inertia('/adminpanel/discount/add', 'adminPanel/price/AddDiscount')->name('adminAddDiscount ');
Route::post('/adminpanel/discount/add', [DiscountController::class, 'addDiscount'])->name('adminAddDiscount ');
Route::inertia('/adminpanel/internal-services', 'adminPanel/additionalServices/InternalServices')->name('adminInternalServices ');
Route::get('adminpanel/external-services', [\App\Http\Controllers\ExtraServicesController::class, 'showAll'])->name('adminExternalServices ');

Route::post('/deneme',[AuthController::class, 'deneme']);
Route::post('/adminpanel/campaign/add', [\App\Http\Controllers\CampaignsController::class, 'addCampaign'])->name('adminAddCampaign');


