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
use App\Models\Discount;
    use App\Models\Fuel;
    use App\Models\Language;
    use App\Models\Segment;
    use App\Models\Translation;
    use App\Models\TranslationKey;
    use App\Models\Transmission;
    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\CarController;
    use App\Http\Controllers\LocationsController;
    use App\Http\Controllers\ReservationController;
    use Illuminate\Support\Facades\Session;
    use Inertia\Inertia;
    use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

    Route::inertia("/test", 'Test');
    Route::get('/supported-languages', function() {
        $languages = Language::where('status', 'active')->pluck('code');
        return response()->json($languages);
    });
    Route::get('/translations/{lang}', function($lang) {
        $translations = Translation::with('translationKey')
            ->whereHas('language', fn($q) => $q->where('code', $lang))
            ->get()
            ->mapWithKeys(fn($t) => [$t->translationKey->key => $t->value]);

        return response()->json($translations);
    });

    Route::get('/get-current-language', function() {
        $lng = Session::get('locale');
       return response()->json($lng);
    });

    Route::get('/test-lang', function () {
        session()->put('deneme', true);
        $locale = LaravelLocalization::getCurrentLocale();
       return redirect('get-session');
    });

    Route::get('get-session', function () {
       dd(session()->all());
    });

    Route::post('/adminpanel/car/add', [CarController::class, 'addCar'])->name('adminAddCar');

    Route::get('/adminpanel/get-all-cars-info', function() {
        try {
            $segments = Segment::with('translationKey')->get();
            $bodyTypes = BodyType::with('translationKey')->get();
            $fuels = Fuel::with('translationKey')->get();
            $transmissions = Transmission::with('translationKey')->get();
            $languages = Language::where('status', 'active')->get();
            return response()->json(['segments' => $segments, 'bodyTypes' => $bodyTypes, 'fuels' => $fuels, 'transmissions' => $transmissions, 'languages' => $languages]);
        }catch (Exception $e){
            return response()->json($e);
        }
    });

    Route::group([
        'prefix' => LaravelLocalization::setLocale(),
        'middleware' => [
            'detectBrowserLocale',
            'localeSessionRedirect',
            'localizationRedirect',
            'localeViewPath',
        ]
    ], function() {

        Route::inertia('/', 'Home')->name('home');
        Route::get(dbTransRoute('cars'), [CarController::class, 'showAllCars'])->name('showCars');
        Route::get(dbTransRoute('cars').'/{id}', [CarController::class, 'showCar'])->name('showIndexCar');
        Route::inertia(dbTransRoute('locations'), 'Locations')->name('locations');
        Route::get(dbTransRoute('campaigns'), [CampaignsController::class, 'showAll'])->name('allCampaigns');
        Route::get(dbTransRoute('campaigns').'/{id}', [CampaignsController::class, 'showIndex'])->name('showCampaign');
        Route::inertia(dbTransRoute('carporateRental'), 'CorporateRental')->name('carporateRental');
        Route::inertia(dbTransRoute('about'), 'About')->name('about');
        Route::inertia(dbTransRoute('blog'), 'Blog')->name('blog');
        Route::inertia(dbTransRoute('auth'), 'auth/Auth')->name('auth');
        Route::get(dbTransRoute('searchReservations'), [ReservationController::class, 'searchReservations'])->name('searchReservations');
        Route::post('/auth', [AuthController::class, 'auth'])->name('auth');
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/location', [LocationsController::class, 'index']);

        Route::inertia(dbTransRoute('adminpanel'), 'adminPanel/Home')->name('adminHome');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('cars'), [AdminCarController::class, 'showAll'])->name('adminCars');
        Route::post('/adminpanel/cars/{id}', [AdminCarController::class, 'updateCar'])->name('adminUpdateCar');
        Route::inertia(dbTransRoute('adminpanel') .'/'. dbTransRoute('cars') .'/'. dbTransRoute('add'), 'adminPanel/cars/AddCar')->name('adminAddCar');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('cars'). '/{id}', [AdminCarController::class, 'showIndex'])->name('adminShowCar');

        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('campaigns'), [CampaignsController::class, 'showAllAdminPanel'])->name('showAllCampaignsAdminPanel');
        Route::post('/adminpanel/campaigns', [CampaignsController::class, 'deleteCampaign'])->name('adminDeleteCampaign');
        Route::post('/adminpanel/campaigns/{id}', [CampaignsController::class, 'updateCampaign'])->name('adminUpdateCampaign');
        Route::get( dbTransRoute('adminpanel') .'/'. dbTransRoute('campaigns') .'/'. dbTransRoute('add'), function (){
            $languages = Language::where('status', 'active')->get();
            return Inertia::render('adminPanel/campaigns/AddCampaign', ['languages' => $languages]);
        })->name('adminAddCampaign ');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('campaigns').'/{id}', [CampaignsController::class, 'showIndexAdminPanel'])->name('showIndexAdminPanel');
        Route::post('/adminpanel/campaign/add', [CampaignsController::class, 'addCampaign'])->name('adminAddCampaign');

        Route::inertia(dbTransRoute('adminpanel'). '/'. dbTransRoute('locations'), 'adminPanel/locations/Locations')->name('adminLocations ');
        Route::inertia(dbTransRoute('adminpanel'). '/'. dbTransRoute('locations').'/'.dbTransRoute('add'), 'adminPanel/locations/AddLocation')->name('adminAddLocation ');
        Route::inertia(dbTransRoute('adminpanel'). '/'. dbTransRoute('reservations'), 'adminPanel/reservation/Reservations')->name('adminReservations ');
        Route::inertia(dbTransRoute('adminpanel'). '/'. dbTransRoute('reservations') .'/'. dbTransRoute('add'), 'adminPanel/reservations/AddReservation')->name('adminAddReservation ');
        Route::inertia(dbTransRoute('adminpanel'). '/'. dbTransRoute('add'), 'adminPanel/users/Users')->name('adminUsers ');

        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('drop-price'), [DropPriceController::class, 'showAdminDropPrice'])->name('adminShowDropPrice');
        Route::post('/adminpanel/drop-price', [DropPriceController::class, 'addDropPrice'])->name('adminAddDropPrice ');

        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('discounts'), function () {
            $discounts = Discount::with('car')->get();
            return Inertia::render('adminPanel/price/Discounts', ['data' => $discounts]);
        })->name('adminAddDropPrice');
        Route::inertia(dbTransRoute('adminpanel').'/'. dbTransRoute('discounts').'/'. dbTransRoute('add'), 'adminPanel/price/AddDiscount')->name('adminAddDiscount ');
        Route::post('/adminpanel/discount/add', [DiscountController::class, 'addDiscount'])->name('adminAddDiscount ');

        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('internal-services'), [\App\Http\Controllers\InternalServiceController::class, 'showAll'])->name('adminShowInternalServices');
        Route::post('/adminpanel/internal-services', [\App\Http\Controllers\InternalServiceController::class, 'addInternalService'])->name('adminAddInternalService');
        Route::delete('/adminpanel/internal-services', [\App\Http\Controllers\InternalServiceController::class, 'deleteService'])->name('adminAddInternalService');

        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('external-services'), [ExtraServicesController::class, 'showAll'])->name('adminShowExternalServices');
        Route::post('/adminpanel/external-services', [ExtraServicesController::class, 'add'])->name('adminAddExternalServices');
        Route::delete('/adminpanel/extra-services', [ExtraServicesController::class, 'destroy'])->name('adminDestroyExternalServices');

        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('languages'), function (){
            $languages = Language::all();
            return Inertia::render('adminPanel/languages/Languages', ['languages' => $languages]);
        })->name('adminShowLanguages');

        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('languages').'/'. dbTransRoute('add'), function (){
            $keys = TranslationKey::all();
            return Inertia::render('adminPanel/languages/AddLanguages', ['keys' => $keys]);
        })->name('adminAddLanguages');
        Route::post('/adminpanel/languages/add', [TranslationController::class, 'addLanguage'])->name('adminAddLanguages');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('languages').'/{id}', function ($id){
            $lang = Language::with('translations')->find($id);
            $keys = TranslationKey::all();
            $campaigns = Campaigns::all();
            return Inertia::render('adminPanel/languages/IndexLanguage', ['language' => $lang, 'keys' => $keys, 'campaigns' => $campaigns]);
        })->name('adminShowIndexLanguage');
        Route::patch('/adminpanel/languages/{id}/active', [TranslationController::class, 'setActiveLanguage'])->name('adminSetActiveLanguage');
        Route::put('/adminpanel/languages/{id}', [TranslationController::class, 'updateLanguage'])->name('adminUpdateLanguage');
        Route::delete('/adminpanel/languages/{id}', [TranslationController::class, 'deleteLanguage'])->name('adminDeleteLanguage');
        Route::put('/adminpanel/languages/{id}/update-site-variable', [TranslationController::class, 'updateSiteVariable'])->name('adminUpdateSiteVariable');

        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('segments'), function () {
            $segments = Segment::all()->fresh();
            return inertia::render('adminPanel/carProperties/segments/Segments', ['segments' => $segments]);
        })->name('adminCarSegments');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('segments').'/{id}', function($id){
            $segment = Segment::find($id);
            $translations = Translation::where('translation_key_id', $segment->translation_key_id)->get();
            $lngs = Language::where('status', 'active')->get();
            return Inertia::render('adminPanel/carProperties/segments/IndexSegment', ['segment' => $segment, 'lngs' => $lngs, 'translations' => $translations]);
        })->name('adminCarIndexSegment')->where('id', '[0-9]+');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('segments').'/'. dbTransRoute('add') , function () {
            $lngs = Language::where('status', 'active')->get();
            return Inertia::render('adminPanel/carProperties/segments/AddSegment', ['lngs' => $lngs]);
        })->name('adminAddSegment');
        Route::put('/adminpanel/segments/{id}', [SegmentController::class, 'updateSegment'])->name('adminUpdateSegment')->where('id', '[0-9]+');
        Route::post('/adminpanel/segments/add', [SegmentController::class, 'addSegment'])->name('adminAddSegment');

        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('body_types'), function() {
            $types = BodyType::all();
            return inertia::render('adminPanel/carProperties/bodyTypes/BodyTypes', ['types' => $types]);
        })->name('adminBodyTypes');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('body_types').'/{id}', function($id){
            $bt = BodyType::find($id);
            $languages = Language::all();
            return Inertia::render('adminPanel/carProperties/bodyTypes/IndexBodyType', ['bt' => $bt, 'languages' => $languages]);
        })->name('adminIndexBodyType')->where('id', '[0-9]+');
        Route::put('/adminpanel/body_types/{id}', [BodyTypeController::class, 'updateBodyType'])->name('adminUpdateBodyType')->where('id', '[0-9]+');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('body_types').'/'. dbTransRoute('add') , function () {
            $lngs = Language::where('status', 'active')->get();
            return Inertia::render('adminPanel/carProperties/bodyTypes/AddBodyType', ['lngs' => $lngs]);
        })->name('adminAddBodyType');
        Route::post('/adminpanel/body_types/add', [BodyTypeController::class, 'addBodyType'])->name('adminAddBodyType');

        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('fuels'), function(){
            $fuels = Fuel::all();
            return inertia::render('adminPanel/carProperties/fuels/Fuels', ['fuels' => $fuels]);
        })->name('adminFuels');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('fuels').'/{id}', function($id){
            $fuel = Fuel::find($id);
            $languages = Language::all();
            return Inertia::render('adminPanel/carProperties/fuels/IndexFuel', ['fuel' => $fuel, 'languages' => $languages]);
        })->name('adminIndexFuel')->where('id', '[0-9]+');
        Route::put('/adminpanel/fuels/{id}', [FuelController::class, 'updateFuel'])->name('adminUpdateFuel')->where('id', '[0-9]+');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('fuels').'/'. dbTransRoute('add') , function () {
            $lngs = Language::where('status', 'active')->get();
            return Inertia::render('adminPanel/carProperties/fuels/AddFuels', ['lngs' => $lngs]);
        })->name('adminAddFuels');
        Route::post('/adminpanel/fuels/add', [FuelController::class, 'addFuel'])->name('adminAddFuel');

        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('transmissions'), function () {
            $transmissions = Transmission::all();
            return inertia::render('adminPanel/carProperties/transmissions/Transmissions', ['transmissions' => $transmissions]);
        })->name('adminTransmissions');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('transmissions').'/{id}', function($id){
            $transmission = Transmission::find($id);
            $languages = Language::all();
            return Inertia::render('adminPanel/carProperties/transmissions/IndexTransmission', ['transmission' => $transmission, 'languages' => $languages]);
        })->name('adminIndexTransmission')->where('id', '[0-9]+');
        Route::put('/adminpanel/transmissions/{id}', [TransmissionController::class, 'updateTransmission'])->name('adminUpdateTransmission')->where('id', '[0-9]+');
        Route::get(dbTransRoute('adminpanel').'/'. dbTransRoute('transmissions').'/'. dbTransRoute('add') , function () {
            $lngs = Language::where('status', 'active')->get();
            return Inertia::render('adminPanel/carProperties/transmissions/AddTransmission', ['lngs' => $lngs]);
        })->name('adminAddTransmission');
        Route::post('/adminpanel/transmissions/add', [TransmissionController::class, 'addTransmission'])->name('adminAddTransmission');
    });

    Route::get('{any?}', function () {
        return Inertia::render('NotFound');
    })->where('any', '.*');
