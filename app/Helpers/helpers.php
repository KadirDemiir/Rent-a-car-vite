<?php

use Illuminate\Support\Facades\Cache;
use App\Models\Translation;
use App\Models\Language;
use App\Models\Segment;
use App\Models\BodyType;
use App\Models\Fuel;
use App\Models\Transmission;

function getCacheStore() {
    return Cache::store('file');
}

if (!function_exists('dbTransRoute')) {
    function dbTransRoute(string $key): ?string
    {
        $locale = app()->getLocale();
        $cacheKey = "route_{$locale}_{$key}";
        
        return getCacheStore()->remember($cacheKey, 86400, function () use ($key, $locale) {
            
            return Translation::query()
                ->whereHas('translationKey', fn($q) => $q->where('key', "address.{$key}"))
                ->whereHas('language', fn($q) => $q->where('code', $locale))
                ->value('value'); // ->first()->value yerine direkt value() daha hafiftir
        });
    }
}

if (!function_exists('getActiveLanguages')) {
    function getActiveLanguages()
    {
        return getCacheStore()->remember('active_languages', 3600, function () {
            return Language::where('status', 'active')->get();
        });
    }
}

if (!function_exists('getSegmentsWithTranslations')) {
    function getSegmentsWithTranslations()
    {
        return getCacheStore()->remember('segments_with_translations', 3600, function () {
            return Segment::with('translationKey')->get();
        });
    }
}

if (!function_exists('getBodyTypesWithTranslations')) {
    function getBodyTypesWithTranslations()
    {
        return getCacheStore()->remember('body_types_with_translations', 3600, function () {
            return BodyType::with('translationKey')->get();
        });
    }
}

if (!function_exists('getFuelsWithTranslations')) {
    function getFuelsWithTranslations()
    {
        return getCacheStore()->remember('fuels_with_translations', 3600, function () {
            return Fuel::with('translationKey')->get();
        });
    }
}

if (!function_exists('getTransmissionsWithTranslations')) {
    function getTransmissionsWithTranslations()
    {
        return getCacheStore()->remember('transmissions_with_translations', 3600, function () {
            return Transmission::with('translationKey')->get();
        });
    }
}

if (!function_exists('getAllCarPropertiesInfo')) {
    function getAllCarPropertiesInfo()
    {
        // Burada tekrar cache yapmaya gerek yok, çünkü çağırdığı fonksiyonlar zaten cache'li.
        // Ama tek bir paket halinde almak istiyorsan bu cache kalabilir.
        return getCacheStore()->remember('all_car_properties_info', 3600, function () {
            return [
                // Burada fonksiyonları çağırmak yerine direkt Query'leri çalıştırmak
                // "Cache Stampede" (Aynı anda çok cache yazma) durumunu engeller.
                // Ama şimdilik basitlik adına fonksiyon çağrısı kalabilir.
                'segments' => getSegmentsWithTranslations(),
                'bodyTypes' => getBodyTypesWithTranslations(),
                'fuels' => getFuelsWithTranslations(),
                'transmissions' => getTransmissionsWithTranslations(),
                'languages' => getActiveLanguages(),
            ];
        });
    }
}

if (!function_exists('clearTranslationCache')) {
    function clearTranslationCache()
    {
        // Cache tag kullanmadığımız için (File driver desteklemez), manuel siliyoruz.
        getCacheStore()->forget('active_languages');
        getCacheStore()->forget('segments_with_translations');
        getCacheStore()->forget('body_types_with_translations');
        getCacheStore()->forget('fuels_with_translations');
        getCacheStore()->forget('transmissions_with_translations');
        getCacheStore()->forget('all_car_properties_info');
        
        // dbTransRoute için wildcard silme file driver'da zordur.
        // Genelde `php artisan cache:clear` en temizidir.
        // Ama kritik rotaları manuel silebilirsin.
    }
}