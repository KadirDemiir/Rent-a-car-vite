<?php

use App\Http\Controllers\AdminCarController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BodyTypeController;
use App\Http\Controllers\CampaignsController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\DropPriceController;
use App\Http\Controllers\EmailTemplateController;
use App\Http\Controllers\ExtraServicesController;
use App\Http\Controllers\FuelController;
use App\Http\Controllers\SegmentController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\TransmissionController;
use App\Models\BodyType;
use App\Models\Campaigns;
use App\Models\CarGroup;
use App\Models\Currency;
use App\Models\Discount;
use App\Models\Fuel;
use App\Models\Language;
use App\Models\Locations;
use App\Models\Reservation;
use App\Models\Segment;
use App\Models\Translation;
use App\Models\TranslationKey;
use App\Models\Transmission;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarController;
use App\Http\Controllers\LocationsController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

Route::post('/make-url', function (Request $request) {
    $request->validate([
        'image' => 'required|image|max:5120',
        'source' => 'required|string'
    ]);

    $source = Str::slug($request->input('source'));
    $file = $request->file('image');

    $hash = md5_file($file->getRealPath());
    $extension = $file->getClientOriginalExtension();
    $fileName = $hash . '.' . $extension;

    $path = $file->storeAs("uploads/{$source}", $fileName, 'public');

    return response()->json([
        'url' => asset("storage/{$path}"),
        'path' => $path
    ]);
});
Route::get('/locales/{locale}/translation.json', [TranslationController::class, 'fetch'])
    ->name('translations.fetch');
Route::middleware('admin')->group(function () {
    Route::post('/adminpanel/cars/update-sort', [AdminCarController::class, 'updateSortOrder'])->name('adminUpdateCarSort');
    Route::post('/adminpanel/car/add', [CarController::class, 'addCar'])->name('adminAddCar');
    Route::post('/adminpanel/car-groups', [AdminCarController::class, 'storeCarGroup'])->name('adminStoreCarGroup');
    Route::post('/adminpanel/car-groups/{id}/vehicles', [AdminCarController::class, 'storeVehicle'])->name('adminStoreVehicle');
    Route::post('/adminpanel/car_groups/{id}', [AdminCarController::class, 'updateCarGroup'])->name('adminUpdateCar');
    Route::post('/adminpanel/locations/add', [LocationsController::class, 'addLocation'])->name('adminAddLocation');
    Route::post('/adminpanel/locations/update/{id}', [LocationsController::class, 'updateLocation'])->name('adminUpdateLocation');
    Route::post('/adminpanel/campaigns', [CampaignsController::class, 'deleteCampaign'])->name('adminDeleteCampaign');
    Route::post('/adminpanel/campaigns/{id}', [CampaignsController::class, 'updateCampaign'])->name('adminUpdateCampaign');
    Route::post('/adminpanel/campaign/add', [CampaignsController::class, 'addCampaign'])->name('adminAddCampaign');
    Route::get('/adminpanel/get-all-cars-info', function () {
        try {
            $allInfo = getAllCarPropertiesInfo();
            $languages = getActiveLanguages();
            return response()->json(['segments' => $allInfo['segments'], 'bodyTypes' => $allInfo['bodyTypes'], 'fuels' => $allInfo['fuels'], 'transmissions' => $allInfo['transmissions'], 'languages' => $languages]);
        } catch (Exception $e) {
            return response()->json($e);
        }
    });
    Route::get('/adminpanel/get-locations', function () {
        return response()->json([
            'success' => true,
            'locations' => Locations::where('is_active', true)->get(),
            //'active_locations' => Locations::where('is_active', 1)->with(['translations', 'city.translations'])->get()
        ]);
    });
    Route::get('/adminpanel/get-info/locations/{id}', [LocationsController::class, 'getIndexLocationInfo']);
    Route::get('/get-reservations-informations', function () {
        $data = Reservation::with(['extras.extra', 'carGroup', 'assignedVehicle', 'pickupLocation', 'returnLocation', 'currency'])->get();
        if ($data->isEmpty()) {
            return response()->json(['message' => 'Veritabanında rezervasyon bulunamadı.'], 404);
        }
        return response()->json(['reservations' => $data], 200);
    });
});

Route::get('/get-car-information/{id}', function ($id) {
    $car = CarGroup::where('id', $id)
        ->with(['reservations', 'photos', 'cars.carGroup'])
        ->with(['price' => function ($query) {
            $query->where('is_active', 1);
        }])
        ->first();

    if (!$car) {
        return response()->json(['error' => 'Araba bulunamadı'], 404);
    }
    return response()->json(['car' => $car]);
})->middleware('admin');

Route::get('/supported-languages', function () {
    $languages = getActiveLanguages()->pluck('code');
    return response()->json($languages);
});
Route::get('/get-supported-languages', function () {
    $languages = getActiveLanguages();
    return response()->json(['languages' => $languages]);
});
Route::get('/translations/{lang}', function ($lang) {
    $translations = \App\Services\TranslationService::getTranslationsByLanguage($lang);
    return response()->json($translations);
});
Route::get('/get-current-language', function () {
    $lng = Session::get('locale');
    return response()->json($lng);
});
Route::get('/test-lang', function () {
    session()->put('deneme', true);
    return redirect('get-session');
});

Route::post('/adminpanel/auth', [AuthController::class, 'adminLogin']);
/* Route::get('/deneme-curr', function () {
    $def = Currency::where('is_active', 1)->where('is_default', 1)->first();
    if (!$def)
        return response()->json(['error' => 'Default currency not found'], 404);
    $response = Http::get('https://www.tcmb.gov.tr/kurlar/today.xml');
    $xml = simplexml_load_string($response->body());
    $tcmbRates = collect();
    foreach ($xml->Currency as $c) {
        $tcmbRates->push([
            'code' => (string)$c['CurrencyCode'],
            'name' => (string)$c->Isim,
            'forexBuying' => (float)str_replace(',', '.', $c->ForexBuying),
            'forexSelling' => (float)str_replace(',', '.', $c->ForexSelling),
        ]);
    }
    if (strtolower($def->code) != "try")
        $base = $tcmbRates->firstWhere('code', strtoupper($def->code));
    else
        $base = ['code' => strtoupper($def->code), 'forexBuying' => 1];
    if (!$base || empty($base['forexBuying']))
        return response()->json(['error' => 'Base currency rate not found in TCMB data'], 400);
    $baseRate = $base['forexBuying'];
    $myCurr = Currency::where('is_active', 1)->get();
    $result = $myCurr->map(function ($curr) use ($tcmbRates, $baseRate, $base) {
        if (strtoupper($curr->code) == "TRY")
            $tcmb['forexBuying'] = 1;
        else
            $tcmb = $tcmbRates->firstWhere('code', strtoupper($curr->code));
        $rate = $tcmb ? $baseRate / $tcmb['forexBuying'] : 1;
        return ['code' => $curr->code, 'symbol' => $curr->symbol, 'exchange_rate' => $rate,];
    });
    return response()->json($result);
});
Route::get('/get-supported-currencies', function () {
    return response()->json(['currencies' => Currency::where('is_active', true)->get()]);
}); */
Route::get('/get-currencies', function () {
    \Illuminate\Support\Facades\Log::info('Currency Route Hit: ' . now());
    $currencies = Cache::store('file')->remember('active_currencies', 3600, function () {
        \Illuminate\Support\Facades\Log::info('CACHE MISS: Fetching from TCMB ' . now());
        $def = Currency::where('is_active', 1)->where('is_default', 1)->first();
        if (!$def) {
            throw new \Exception('Default currency not found');
        }
        try {
            $response = Http::timeout(5)->get('https://www.tcmb.gov.tr/kurlar/today.xml');
            if ($response->failed()) throw new \Exception('TCMB Unreachable');
            $xml = simplexml_load_string($response->body());
            if ($xml === false) throw new \Exception('Invalid XML');
        } catch (\Exception $e) {
            Log::error('Currency fetch error: ' . $e->getMessage());
            return Currency::where('is_active', true)->get();
        }
        $tcmbRates = collect();
        foreach ($xml->Currency as $c) {
            $tcmbRates->push([
                'code' => (string)$c['CurrencyCode'],
                'forexBuying' => (float)str_replace(',', '.', $c->ForexBuying),
            ]);
        }
        $defCode = strtoupper($def->code);
        if ($defCode === 'TRY') {
            $baseRate = 1;
        } else {
            $baseCurrencyData = $tcmbRates->firstWhere('code', $defCode);
            $baseRate = ($baseCurrencyData && !empty($baseCurrencyData['forexBuying']))
                ? $baseCurrencyData['forexBuying']
                : 1;
        }
        $myCurrs = Currency::where('is_active', 1)->get();
        foreach ($myCurrs as $curr) {
            $currCode = strtoupper($curr->code);
            if ($currCode === 'TRY') {
                $targetRateTRY = 1;
            } else {
                $tcmbData = $tcmbRates->firstWhere('code', $currCode);
                $targetRateTRY = $tcmbData ? $tcmbData['forexBuying'] : 1;
            }
            $exchangeRate = $baseRate / ($targetRateTRY ?: 1);
            $curr->update(['exchange_rate' => $exchangeRate]);
        }
        return $myCurrs;
    });
    return response()->json($currencies);
});
Route::get('get-session', function () {
    dd(session()->all());
});
Route::get('/get-all-cars-info', function () {
    return response()->json(getAllCarPropertiesInfo());
})->withoutMiddleware([\App\Http\Middleware\HandleInertiaRequests::class]);
Route::get('/get-extras', function () {
    return response()->json(['extras' => \App\Models\ExtraServices::where('stock', '>', 0)->with('extraServicePrices')->get()]);
})->withoutMiddleware([\App\Http\Middleware\HandleInertiaRequests::class]);
Route::get('/get-included-services', function () {
    return response()->json(['services' => \App\Models\InternalService::all()]);
})->withoutMiddleware([\App\Http\Middleware\HandleInertiaRequests::class]);
Route::post('/create-reservation', [ReservationController::class, 'createReservation'])->name('createReservation');
Route::post('/reservation/reject/{id}', [ReservationController::class, 'rejectReservation'])->name('rejectReservation');
Route::post('/reservation/approve/{id}', [ReservationController::class, 'approveReservation'])->name('approveReservation');

Route::get('/get-locations', function () {
    return response()->json([
        'success' => true,
        'locations' => Locations::select('id', 'name', 'city', 'address', 'phone', 'email', 'latitude', 'longitude', 'photo_path')
            ->where('is_active', 1)
            ->get()
    ], 200);
});

Route::post('/auth', [AuthController::class, 'auth'])->name('auth.login');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
Route::get('/reset-password/{token}', function ($token) {
    return Inertia::render('auth/ResetPassword', [
        'token' => $token,
        'email' => request('email')
    ]);
})->name('password.reset');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');

Route::group([
    'prefix' => LaravelLocalization::setLocale(),
    'middleware' => [
        'detectBrowserLocale',
        'localeSessionRedirect',
        'localizationRedirect',
        'localeViewPath',
    ]
], function () {

    Route::get('', function () {
        $carGroups = CarGroup::with(['photos'])->get();
        return Inertia::render('Home', [
            'sections' => getSectionsCache(),
            'locations' => Locations::select('id', 'name', 'photo_path')->where('is_active', true)->get(),
            'carGroups' => $carGroups,
            ]);
    })->middleware('check.page.group:home')->name('home');

    Route::get(dbTransRoute('cars'), [CarController::class, 'showAllCars'])->middleware('check.page.group:cars')->name('showCars');

    //Route::get(dbTransRoute('cars') . '/{id}', [CarController::class, 'showCar'])->name('showIndexCar');
    Route::inertia(dbTransRoute('locations'), 'Locations')->middleware('check.page.group:locations')->name('locations');

    Route::middleware('check.page.group:campaigns')->group(function () {
        Route::get(dbTransRoute('campaigns'), [CampaignsController::class, 'showAll'])->name('allCampaigns');
        Route::get(dbTransRoute('campaigns') . '/{id}', [CampaignsController::class, 'showIndex'])->name('showCampaign');
    });

    Route::inertia(dbTransRoute('carporateRental'), 'CorporateRental')->middleware('check.page.group:corporate')->name('carporateRental');

    Route::get(dbTransRoute('about'), [\App\Http\Controllers\AboutController::class, 'show'])->middleware('check.page.group:about')->name('about');

    Route::get(dbTransRoute('blog'), [\App\Http\Controllers\BlogController::class, 'showBlogs'])->middleware('check.page.group:blog')->name('showBlogs');
    Route::get(dbTransRoute('blog') .'/{slug}', [\App\Http\Controllers\BlogController::class, 'showIndexBlog'])->middleware('check.page.group:blog')->name('showIndexBlog');

    Route::inertia(dbTransRoute('auth'), 'auth/Auth')->middleware('check.page.group:auth')->name('showAuth');

    Route::get(dbTransRoute('searchReservations'), [ReservationController::class, 'searchReservations'])->middleware('check.page.group:reservation-search')->name('searchReservations');
    Route::post(dbTransRoute('reservation-create'), [ReservationController::class, 'initiateDraft'])->name('reservation.init');
    Route::get(dbTransRoute('reservation-create'), [ReservationController::class, 'showExtras'])->middleware('check.page.group:reservation-create')->name('reservation-create');

    Route::get('/r/track/{token}', [ReservationController::class, 'track'])
        ->name('reservation.track');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::middleware('auth')->group(function () {
        Route::get('/my-reservations', [ReservationController::class, 'myReservations'])->name('myReservations');
        Route::patch('/my-reservations/{id}/cancel', [ReservationController::class, 'cancelReservation'])->name('cancelMyReservation');
    });
    Route::get('/location', [LocationsController::class, 'index']);

    Route::get(dbTransRoute ('checkReservation'), [ReservationController::class, 'checkReservationPage'])->name('checkReservationPage');
    Route::post(dbTransRoute('checkReservation'), [ReservationController::class, 'checkReservation'])->name('checkReservation');
    Route::post('/guest-reservation/{id}/cancel', [ReservationController::class, 'guestCancelReservation'])->name('guestCancelReservation');

    // Admin Login Routes
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('auth'), [AuthController::class, 'showAdminLogin'])->name('admin.login');

    Route::middleware('admin')->group(function () {
        Route::get(dbTransRoute('adminpanel'), function () {
        $upcoming = Reservation::upcoming()->with(['carGroup:id,name', 'user'])->orderBy('pickup_datetime')->get();
        $active = Reservation::activeRentals()->with(['carGroup:id,name', 'assignedVehicle', 'user'])->orderBy('return_datetime')->get();
        $late = Reservation::lateReturns()->with(['carGroup:id,name', 'assignedVehicle', 'user'])->orderBy('return_datetime')->get();

        return Inertia::render('adminPanel/Home', [
            'upcomingReservations' => $upcoming,
            'activeReservations' => $active,
            'lateReservations' => $late,
        ]);
    })->name('adminHome');
    Route::post(dbTransRoute('adminpanel') . '/admin', [AuthController::class, 'updateAdminPassword'])->name('adminUpdatePassword');
    Route::get(dbTransRoute('adminpanel') . '/admin', [AuthController::class, 'showAdminChangePassword'])->name('adminChangePassword');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('car_groups') . '/' . dbTransRoute('add'), [AdminCarController::class, 'showAddCarGroup'])->name('adminAddCarGroupPage');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('car_groups') . '/{slug}', [AdminCarController::class, 'showIndexGroup'])->name('adminShowCar');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('car_groups'), [AdminCarController::class, 'showAllCarGroups'])->name('adminCars');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('cars') . '/' . dbTransRoute('add'), [AdminCarController::class, 'showAddCar'])->name('adminAddCarPage');
    Route::get(dbTransRoute('adminpanel') . '/'. dbTransRoute('cars'), [AdminCarController::class, 'showAllCars'])->name('adminVehicles');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('cars') . '/{id}', [AdminCarController::class, 'showIndexCar'])->name('adminShowVehicle');
    Route::get('/adminpanel/cars/{id}/info', [AdminCarController::class, 'getCarInfo'])->name('adminGetCarInfo');
    Route::post('/adminpanel/cars/{id}/update', [AdminCarController::class, 'updateCar'])->name('adminUpdateVehicle');
    Route::delete('/adminpanel/cars/{id}', [AdminCarController::class, 'deleteCar'])->name('adminDeleteVehicle');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('campaigns'), [CampaignsController::class, 'showAllAdminPanel'])->name('showAllCampaignsAdminPanel');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('campaigns') . '/' . dbTransRoute('add'), function () {
        $languages = getActiveLanguages();
        return Inertia::render('adminPanel/campaigns/AddCampaign', ['languages' => $languages]);
    })->name('adminAddCampaignPage');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('campaigns') . '/{id}', [CampaignsController::class, 'showIndexAdminPanel'])->name('showIndexAdminPanel');

    Route::inertia(dbTransRoute('adminpanel') . '/' . dbTransRoute('locations'), 'adminPanel/locations/Locations')->name('adminLocations');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('locations'). '/{id}', function ($id) {
        return inertia('adminPanel/locations/IndexLocation', [
            'id' => $id
        ]);
    })->name('adminIndexLocations');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('reservations'), [ReservationController::class, 'showReservations'])->name('adminReservations');
    Route::get('/adminpanel/reservations/{id}/available-cars', [ReservationController::class, 'getAvailableCarsForReservation'])->name('adminGetAvailableCars');
    Route::post('/adminpanel/reservations/{id}/start', [ReservationController::class, 'startRental'])->name('adminStartRental');
    Route::post('/adminpanel/reservations/{id}/complete', [ReservationController::class, 'completeRental'])->name('adminCompleteRental');

    Route::inertia(dbTransRoute('adminpanel') . '/' . dbTransRoute('add'), 'adminPanel/users/Users')->name('adminUsers');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('drop-price'), [DropPriceController::class, 'showAdminDropPrice'])->name('adminShowDropPrice');
    Route::post('/adminpanel/drop-price', [DropPriceController::class, 'addDropPrice'])->name('adminAddDropPrice');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('discounts'), function () {
        $discounts = Discount::with('carGroup')->get();
        return Inertia::render('adminPanel/price/Discounts', ['data' => $discounts]);
    })->name('adminShowDiscounts');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('discounts') . '/' . dbTransRoute('add'), function () {
        $segments = getSegmentsWithTranslations();
        $currencies = Currency::where('is_active', 1)->get();
        return Inertia::render('adminPanel/price/AddDiscount', ['segments' => $segments, 'currencies' => $currencies]);
    })->name('adminAddDiscountForm');
    Route::post('/adminpanel/discount/add', [DiscountController::class, 'addDiscount'])->name('adminAddDiscount');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('internal-services'), [\App\Http\Controllers\InternalServiceController::class, 'showAll'])->name('adminShowInternalServices');
    Route::post('/adminpanel/internal-services', [\App\Http\Controllers\InternalServiceController::class, 'addInternalService'])->name('adminAddInternalService');
    Route::delete('/adminpanel/internal-services', [\App\Http\Controllers\InternalServiceController::class, 'deleteService'])->name('adminDeleteInternalService');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('external-services'), [ExtraServicesController::class, 'showAll'])->name('adminShowExternalServices');
    Route::post('/adminpanel/external-services', [ExtraServicesController::class, 'add'])->name('adminAddExternalServices');
    Route::delete('/adminpanel/extra-services', [ExtraServicesController::class, 'destroy'])->name('adminDestroyExternalServices');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('languages'), function () {
        $languages = Language::all();
        return Inertia::render('adminPanel/languages/Languages', ['languages' => $languages]);
    })->name('adminShowLanguages');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('languages') . '/' . dbTransRoute('add'), function () {
        $keys = TranslationKey::all();
        return Inertia::render('adminPanel/languages/AddLanguages', ['keys' => $keys]);
    })->name('adminAddLanguagesPage');
    Route::post('/adminpanel/languages/add', [TranslationController::class, 'addLanguage'])->name('adminAddLanguages');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('languages') . '/{code}', function ($code) {
        $lang = Language::with('translations')->where('code', $code)->first();
        $keys = TranslationKey::all()->makeVisible(['id']);
        $campaigns = Campaigns::all();
        return Inertia::render('adminPanel/languages/IndexLanguage', ['language' => $lang, 'keys' => $keys, 'campaigns' => $campaigns]);
    })->name('adminShowIndexLanguage');
    Route::patch('/adminpanel/languages/{code}/active', [TranslationController::class, 'setActiveLanguage'])->name('adminSetActiveLanguage');
    Route::put('/adminpanel/languages/{code}', [TranslationController::class, 'updateLanguage'])->name('adminUpdateLanguage');
    Route::delete('/adminpanel/languages/{code}', [TranslationController::class, 'deleteLanguage'])->name('adminDeleteLanguage');
    Route::put('/adminpanel/languages/{code}/update-site-variable', [TranslationController::class, 'updateSiteVariable'])->name('adminUpdateSiteVariable');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('segments'), function () {
        $segments = Segment::all()->fresh();
        return inertia::render('adminPanel/carProperties/segments/Segments', ['segments' => $segments]);
    })->name('adminCarSegments');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('segments') . '/{id}', function ($id) {
        $segment = Segment::find($id);
        $translations = Translation::where('translation_key_id', $segment->translation_key_id)->get();
        $lngs = getActiveLanguages();
        return Inertia::render('adminPanel/carProperties/segments/IndexSegment', ['segment' => $segment, 'lngs' => $lngs, 'translations' => $translations]);
    })->name('adminCarIndexSegment')->where('id', '[0-9]+');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('segments') . '/' . dbTransRoute('add'), function () {
        $lngs = getActiveLanguages();
        return Inertia::render('adminPanel/carProperties/segments/AddSegment', ['lngs' => $lngs]);
    })->name('adminAddSegmentPage');
    Route::put('/adminpanel/segments/{id}', [SegmentController::class, 'updateSegment'])->name('adminUpdateSegment')->where('id', '[0-9]+');
    Route::post('/adminpanel/segments/add', [SegmentController::class, 'addSegment'])->name('adminAddSegment');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('body_types'), function () {
        $types = BodyType::all();
        return inertia::render('adminPanel/carProperties/bodyTypes/BodyTypes', ['types' => $types]);
    })->name('adminBodyTypes');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('body_types') . '/{id}', function ($id) {
        $bt = BodyType::find($id);
        $languages = Language::all();
        return Inertia::render('adminPanel/carProperties/bodyTypes/IndexBodyType', ['bt' => $bt, 'languages' => $languages]);
    })->name('adminIndexBodyType')->where('id', '[0-9]+');
    Route::put('/adminpanel/body_types/{id}', [BodyTypeController::class, 'updateBodyType'])->name('adminUpdateBodyType')->where('id', '[0-9]+');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('body_types') . '/' . dbTransRoute('add'), function () {
        $lngs = getActiveLanguages();
        return Inertia::render('adminPanel/carProperties/bodyTypes/AddBodyType', ['lngs' => $lngs]);
    })->name('adminAddBodyTypePage');
    Route::post('/adminpanel/body_types/add', [BodyTypeController::class, 'addBodyType'])->name('adminAddBodyType');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('fuels'), function () {
        $fuels = Fuel::all();
        return inertia::render('adminPanel/carProperties/fuels/Fuels', ['fuels' => $fuels]);
    })->name('adminFuels');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('fuels') . '/{id}', function ($id) {
        $fuel = Fuel::find($id);
        $languages = Language::all();
        return Inertia::render('adminPanel/carProperties/fuels/IndexFuel', ['fuel' => $fuel, 'languages' => $languages]);
    })->name('adminIndexFuel')->where('id', '[0-9]+');
    Route::put('/adminpanel/fuels/{id}', [FuelController::class, 'updateFuel'])->name('adminUpdateFuel')->where('id', '[0-9]+');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('fuels') . '/' . dbTransRoute('add'), function () {
        $lngs = getActiveLanguages();
        return Inertia::render('adminPanel/carProperties/fuels/AddFuels', ['lngs' => $lngs]);
    })->name('adminAddFuelsPage');
    Route::post('/adminpanel/fuels/add', [FuelController::class, 'addFuel'])->name('adminAddFuel');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('transmissions'), function () {
        $transmissions = Transmission::all();
        return inertia::render('adminPanel/carProperties/transmissions/Transmissions', ['transmissions' => $transmissions]);
    })->name('adminTransmissions');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('transmissions') . '/{id}', function ($id) {
        $transmission = Transmission::find($id);
        $languages = Language::all();
        return Inertia::render('adminPanel/carProperties/transmissions/IndexTransmission', ['transmission' => $transmission, 'languages' => $languages]);
    })->name('adminIndexTransmission')->where('id', '[0-9]+');
    Route::put('/adminpanel/transmissions/{id}', [TransmissionController::class, 'updateTransmission'])->name('adminUpdateTransmission')->where('id', '[0-9]+');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('transmissions') . '/' . dbTransRoute('add'), function () {
        $lngs = getActiveLanguages();
        return Inertia::render('adminPanel/carProperties/transmissions/AddTransmission', ['lngs' => $lngs]);
    })->name('adminAddTransmissionPage');
    Route::post('/adminpanel/transmissions/add', [TransmissionController::class, 'addTransmission'])->name('adminAddTransmission');

    Route::get(dbTransRoute('adminpanel') . '/'. dbTransRoute('email-templates'), [EmailTemplateController::class, 'index'])->name('adminEmailTemplates');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('email-templates') . '/{id}', [EmailTemplateController::class, 'show'])->name('adminShowEmailTemplate');
    Route::post('/adminpanel/email-templates', [EmailTemplateController::class, 'store'])->name('adminStoreEmailTemplate');
    Route::put('/adminpanel/email-templates/{id}', [EmailTemplateController::class, 'update'])->name('adminUpdateEmailTemplate');
    Route::delete('/adminpanel/email-templates/{id}', [EmailTemplateController::class, 'destroy'])->name('adminDeleteEmailTemplate');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('website_settings'), [SectionController::class, 'showPage'])->name('adminShowSiteSettings');
    Route::put('/adminpanel/sections/{id}', [SectionController::class, 'update'])->name('adminUpdateSection');
    Route::post('/adminpanel/sections', [SectionController::class, 'store'])->name('adminStoreSection');
    Route::delete('/adminpanel/sections/{id}', [SectionController::class, 'destroy'])->name('adminDeleteSection');
    Route::post('/adminpanel/sections/reorder', [SectionController::class, 'reorderSections'])->name('adminReorderSections');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('page_settings'), [\App\Http\Controllers\PageController::class, 'showPage'])->name('adminShowSiteSettings');
    Route::get('/adminpanel/pages', [\App\Http\Controllers\PageController::class, 'index'])->name('adminGetPages');
    Route::post('/adminpanel/pages/{id}/toggle-status', [\App\Http\Controllers\PageController::class, 'toggleStatus'])->name('adminTogglePageStatus');
    Route::put('/pages/{page}', [\App\Http\Controllers\PageController::class, 'update'])->name('admin.pages.update');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('about_page'), [\App\Http\Controllers\AboutController::class, 'showPage'] )->name('adminAboutPage');
    Route::post('/adminpanel/about_page', [\App\Http\Controllers\AboutController::class, 'add'])->name('admin.pages.update');

    Route::get(dbTransRoute('adminpanel') . '/'. dbTransRoute('blog_page'), [\App\Http\Controllers\BlogController::class, 'showAdminPage'] )->name('showAdminBlogPage');
    Route::get(dbTransRoute('adminpanel') . '/'. dbTransRoute('blog_page') . '/' . dbTransRoute('add') , [\App\Http\Controllers\BlogController::class, 'showAdminAddPage'] )->name('showAdminAddBlogPage');
    Route::post('/adminpanel/blogs', [\App\Http\Controllers\BlogController::class, 'add'])->name('admin.pages.add');

    });
});


Route::get('{any?}', function () {
    return Inertia::render('NotFound');
})->where('any', '.*')->name('pageNotFound');
