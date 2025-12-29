<?php

use App\Http\Controllers\AdminCarController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BodyTypeController;
use App\Http\Controllers\CampaignsController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\DropPriceController;
use App\Http\Controllers\ExtraServicesController;
use App\Http\Controllers\FuelController;
use App\Http\Controllers\SegmentController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\TransmissionController;
use App\Models\BodyType;
use App\Models\Campaigns;
use App\Models\Car;
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
use Illuminate\Http\Request;
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

Route::get('/get-reservations-informations', function () {
    return response(['reservations' => Reservation::with(['extras', 'pickupLocation', 'returnLocation'])->get()], 200);
});
Route::get('/get-car-information/{id}', function ($id) {
    $car = Car::where('id', $id)
        ->with(['reservations', 'photos', 'brandKey', 'modelKey'])
        ->with(['price' => function ($query) {
            $query->where('is_active', 1);
        }])
        ->first();

    if (!$car) {
        return response()->json(['error' => 'Araba bulunamadı'], 404);
    }
    return response()->json(['car' => $car]);
});
Route::get('/supported-languages', function () {
    $languages = Language::where('status', 'active')->pluck('code');
    return response()->json($languages);
});
Route::get('/get-supported-languages', function () {
    $languages = Language::where('status', 'active')->get();
    return response()->json(['languages' => $languages]);
});
Route::get('/translations/{lang}', function ($lang) {
    /*Log::info('web.php translation dili => ', ['language' => $lang]);*/
    $translations = Translation::with('translationKey')
        ->whereHas('language', fn($q) => $q->where('code', $lang))
        ->get()
        ->mapWithKeys(fn($t) => [$t->translationKey->key => $t->value]);
    /*Log::info('web.php translation değerleri => ', ['language' => $translations]);*/
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
Route::get('/deneme-curr', function () {
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
});
Route::get('/get-currencies', function () {
    $currencies = Cache::remember('active_currencies', 0, function () {
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
Route::post('/adminpanel/car/add', [CarController::class, 'addCar'])->name('adminAddCar');
Route::get('/adminpanel/get-all-cars-info', function () {
    try {
        $segments = Segment::with('translationKey')->get();
        $bodyTypes = BodyType::with('translationKey')->get();
        $fuels = Fuel::with('translationKey')->get();
        $transmissions = Transmission::with('translationKey')->get();
        $languages = Language::where('status', 'active')->get();
        return response()->json(['segments' => $segments, 'bodyTypes' => $bodyTypes, 'fuels' => $fuels, 'transmissions' => $transmissions, 'languages' => $languages]);
    } catch (Exception $e) {
        return response()->json($e);
    }
});
Route::get('/get-all-cars-info', function () {
    try {
        $segments = Segment::with('translationKey')->get();
        $bodyTypes = BodyType::with('translationKey')->get();
        $fuels = Fuel::with('translationKey')->get();
        $transmissions = Transmission::with('translationKey')->get();
        return response()->json(['segments' => $segments, 'bodyTypes' => $bodyTypes, 'fuels' => $fuels, 'transmissions' => $transmissions]);
    } catch (Exception $e) {
        return response()->json($e);
    }
});
Route::post('/adminpanel/cars/{id}', [AdminCarController::class, 'updateCar'])->name('adminUpdateCar');
Route::get('/get-extras', function () {
    return response()->json(['extras' => \App\Models\ExtraServices::where('stock', '>', 0)->with('extraServicePrices')->get()]);
});
Route::post('/create-reservation', [ReservationController::class, 'createReservation'])->name('createReservation');
Route::patch('/reservation/reject/{id}', [ReservationController::class, 'rejectReservation'])->name('rejectReservation');

Route::post('/adminpanel/locations/add', [LocationsController::class, 'addLocation'])->name('adminAddLocation');

Route::get('/adminpanel/get-locations', function () {
    $locations = \App\Models\Locations::with('parent')->get();
    return response()->json([
        'success' => true,
        'data'    => $locations,
        'count'   => $locations->count()
    ], 200);
});

Route::group([
    'prefix' => LaravelLocalization::setLocale(),
    'middleware' => [
        'detectBrowserLocale',
        'localeSessionRedirect',
        'localizationRedirect',
        'localeViewPath',
    ]
], function () {

    Route::get('/', function () {
        return Inertia::render('Home', ['locations' => Locations::all()]);
    })->name('home');
    Route::get(dbTransRoute('cars'), [CarController::class, 'showAllCars'])->name('showCars');
    Route::get(dbTransRoute('cars') . '/{id}', [CarController::class, 'showCar'])->name('showIndexCar');
    Route::inertia(dbTransRoute('locations'), 'Locations')->name('locations');
    Route::get(dbTransRoute('campaigns'), [CampaignsController::class, 'showAll'])->name('allCampaigns');
    Route::get(dbTransRoute('campaigns') . '/{id}', [CampaignsController::class, 'showIndex'])->name('showCampaign');
    Route::inertia(dbTransRoute('carporateRental'), 'CorporateRental')->name('carporateRental');
    Route::inertia(dbTransRoute('about'), 'About')->name('about');
    Route::inertia(dbTransRoute('blog'), 'Blog')->name('blog');
    Route::inertia(dbTransRoute('auth'), 'auth/Auth')->name('auth');
    Route::get(dbTransRoute('searchReservations'), [ReservationController::class, 'searchReservations'])->name('searchReservations');
    Route::get(dbTransRoute('reservation-create'), [ReservationController::class, 'showDetailPage'])->name('reservation-create');
    Route::post('/auth', [AuthController::class, 'auth'])->name('auth');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/location', [LocationsController::class, 'index']);

    Route::inertia(dbTransRoute('adminpanel'), 'adminPanel/Home')->name('adminHome');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('cars'), [AdminCarController::class, 'showAll'])->name('adminCars');
    Route::inertia(dbTransRoute('adminpanel') . '/' . dbTransRoute('cars') . '/' . dbTransRoute('add'), 'adminPanel/cars/AddCar')->name('adminAddCar');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('cars') . '/{id}', [AdminCarController::class, 'showIndex'])->name('adminShowCar');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('campaigns'), [CampaignsController::class, 'showAllAdminPanel'])->name('showAllCampaignsAdminPanel');
    Route::post('/adminpanel/campaigns', [CampaignsController::class, 'deleteCampaign'])->name('adminDeleteCampaign');
    Route::post('/adminpanel/campaigns/{id}', [CampaignsController::class, 'updateCampaign'])->name('adminUpdateCampaign');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('campaigns') . '/' . dbTransRoute('add'), function () {
        $languages = Language::where('status', 'active')->get();
        return Inertia::render('adminPanel/campaigns/AddCampaign', ['languages' => $languages]);
    })->name('adminAddCampaign ');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('campaigns') . '/{id}', [CampaignsController::class, 'showIndexAdminPanel'])->name('showIndexAdminPanel');
    Route::post('/adminpanel/campaign/add', [CampaignsController::class, 'addCampaign'])->name('adminAddCampaign');

    Route::inertia(dbTransRoute('adminpanel') . '/' . dbTransRoute('locations'), 'adminPanel/locations/Locations')->name('adminLocations ');
    Route::inertia(dbTransRoute('adminpanel') . '/' . dbTransRoute('locations') . '/' . dbTransRoute('add'), 'adminPanel/locations/AddLocation')->name('adminAddLocation ');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('reservations'), [ReservationController::class, 'showReservations'])->name('adminReservations ');
    Route::inertia(dbTransRoute('adminpanel') . '/' . dbTransRoute('reservations') . '/' . dbTransRoute('add'), 'adminPanel/reservations/AddReservation')->name('adminAddReservation ');
    Route::inertia(dbTransRoute('adminpanel') . '/' . dbTransRoute('add'), 'adminPanel/users/Users')->name('adminUsers ');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('drop-price'), [DropPriceController::class, 'showAdminDropPrice'])->name('adminShowDropPrice');
    Route::post('/adminpanel/drop-price', [DropPriceController::class, 'addDropPrice'])->name('adminAddDropPrice ');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('discounts'), function () {
        $discounts = Discount::with('car')->get();
        return Inertia::render('adminPanel/price/Discounts', ['data' => $discounts]);
    })->name('adminAddDropPrice');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('discounts') . '/' . dbTransRoute('add'), function () {
        $segments = Segment::with('translationKey')->get();
        $currencies = Currency::where('is_active', 1)->get();
        return Inertia::render('adminPanel/price/AddDiscount', ['segments' => $segments, 'currencies' => $currencies]);
    })->name('adminAddDiscount ');
    Route::post('/adminpanel/discount/add', [DiscountController::class, 'addDiscount'])->name('adminAddDiscount ');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('internal-services'), [\App\Http\Controllers\InternalServiceController::class, 'showAll'])->name('adminShowInternalServices');
    Route::post('/adminpanel/internal-services', [\App\Http\Controllers\InternalServiceController::class, 'addInternalService'])->name('adminAddInternalService');
    Route::delete('/adminpanel/internal-services', [\App\Http\Controllers\InternalServiceController::class, 'deleteService'])->name('adminAddInternalService');

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
    })->name('adminAddLanguages');
    Route::post('/adminpanel/languages/add', [TranslationController::class, 'addLanguage'])->name('adminAddLanguages');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('languages') . '/{id}', function ($id) {
        $lang = Language::with('translations')->find($id);
        $keys = TranslationKey::all();
        $campaigns = Campaigns::all();
        return Inertia::render('adminPanel/languages/IndexLanguage', ['language' => $lang, 'keys' => $keys, 'campaigns' => $campaigns]);
    })->name('adminShowIndexLanguage');
    Route::patch('/adminpanel/languages/{id}/active', [TranslationController::class, 'setActiveLanguage'])->name('adminSetActiveLanguage');
    Route::put('/adminpanel/languages/{id}', [TranslationController::class, 'updateLanguage'])->name('adminUpdateLanguage');
    Route::delete('/adminpanel/languages/{id}', [TranslationController::class, 'deleteLanguage'])->name('adminDeleteLanguage');
    Route::put('/adminpanel/languages/{id}/update-site-variable', [TranslationController::class, 'updateSiteVariable'])->name('adminUpdateSiteVariable');

    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('segments'), function () {
        $segments = Segment::all()->fresh();
        return inertia::render('adminPanel/carProperties/segments/Segments', ['segments' => $segments]);
    })->name('adminCarSegments');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('segments') . '/{id}', function ($id) {
        $segment = Segment::find($id);
        $translations = Translation::where('translation_key_id', $segment->translation_key_id)->get();
        $lngs = Language::where('status', 'active')->get();
        return Inertia::render('adminPanel/carProperties/segments/IndexSegment', ['segment' => $segment, 'lngs' => $lngs, 'translations' => $translations]);
    })->name('adminCarIndexSegment')->where('id', '[0-9]+');
    Route::get(dbTransRoute('adminpanel') . '/' . dbTransRoute('segments') . '/' . dbTransRoute('add'), function () {
        $lngs = Language::where('status', 'active')->get();
        return Inertia::render('adminPanel/carProperties/segments/AddSegment', ['lngs' => $lngs]);
    })->name('adminAddSegment');
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
        $lngs = Language::where('status', 'active')->get();
        return Inertia::render('adminPanel/carProperties/bodyTypes/AddBodyType', ['lngs' => $lngs]);
    })->name('adminAddBodyType');
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
        $lngs = Language::where('status', 'active')->get();
        return Inertia::render('adminPanel/carProperties/fuels/AddFuels', ['lngs' => $lngs]);
    })->name('adminAddFuels');
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
        $lngs = Language::where('status', 'active')->get();
        return Inertia::render('adminPanel/carProperties/transmissions/AddTransmission', ['lngs' => $lngs]);
    })->name('adminAddTransmission');
    Route::post('/adminpanel/transmissions/add', [TransmissionController::class, 'addTransmission'])->name('adminAddTransmission');
});

Route::get('{any?}', function () {
    return Inertia::render('NotFound');
})->where('any', '.*');
