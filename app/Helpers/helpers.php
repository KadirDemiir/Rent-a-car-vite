<?php

use Illuminate\Support\Facades\Cache;
use App\Models\Translation;
use App\Models\Language;
use App\Models\Segment;
use App\Models\BodyType;
use App\Models\Fuel;
use App\Models\Transmission;

function getCacheStore() {
    // Use default cache store from config (database/redis/file based on .env)
    return Cache::store();
}

if (!function_exists('dbTransRoute')) {
    function dbTransRoute(string $key): ?string
    {
        static $routeTranslations = null;
        static $lastLocale = null;

        $locale = app()->getLocale();

        // Load all route translations at once and cache them
        if ($routeTranslations === null || $lastLocale !== $locale) {
            $cacheKey = "all_route_translations_{$locale}";

            $routeTranslations = getCacheStore()->remember($cacheKey, 86400 * 7, function () use ($locale) {
                return Translation::query()
                    ->select('translations.value', 'translation_keys.key')
                    ->join('translation_keys', 'translations.translation_key_id', '=', 'translation_keys.id')
                    ->join('languages', 'translations.language_id', '=', 'languages.id')
                    ->where('translation_keys.key', 'like', 'address.%')
                    ->where('languages.code', $locale)
                    ->pluck('value', 'key')
                    ->toArray();
            });
            $lastLocale = $locale;
        }

        return $routeTranslations["address.{$key}"] ?? $key;
    }
}
// 1. Segmentler: İlişkiye (with) gerek yok, Frontend sadece ID kullanıyor.
if (!function_exists('getSegmentsWithTranslations')) {
    function getSegmentsWithTranslations()
    {
        return getCacheStore()->remember('all_segments', 3600 * 24, function () {
            return Segment::select('id')->get();
        });
    }
}

// 2. Kasa Tipleri
if (!function_exists('getBodyTypesWithTranslations')) {
    function getBodyTypesWithTranslations()
    {
        return getCacheStore()->remember('all_body_types', 3600 * 24, function () {
            return BodyType::select('id')->get();
        });
    }
}

// 3. Yakıt Tipleri
if (!function_exists('getFuelsWithTranslations')) {
    function getFuelsWithTranslations()
    {
        return getCacheStore()->remember('all_fuels', 3600 * 24, function () {
            return Fuel::select('id')->get();
        });
    }
}

// 4. Vites Tipleri
if (!function_exists('getTransmissionsWithTranslations')) {
    function getTransmissionsWithTranslations()
    {
        return getCacheStore()->remember('all_transmissions', 3600 * 24, function () {
            return Transmission::select('id')->get();
        });
    }
}

// 5. Diller
if (!function_exists('getActiveLanguages')) {
    function getActiveLanguages()
    {
        return getCacheStore()->remember('active_languages', 3600 * 24, function () {
            return Language::where('status', 'active')->select('id', 'code', 'name', 'flag_photo_path')->get();
        });
    }
}

if (!function_exists('getAllCarPropertiesInfo')) {
    function getAllCarPropertiesInfo()
    {
        // Cache the entire result for maximum performance
        // Use pluck to get only IDs as simple arrays (much smaller payload)
        return getCacheStore()->remember('all_car_properties_info', 3600 * 24, function () {
            return [
                'segments'      => Segment::pluck('id'),
                'bodyTypes'     => BodyType::pluck('id'),
                'fuels'         => Fuel::pluck('id'),
                'transmissions' => Transmission::pluck('id'),
                'languages'     => Language::where('status', 'active')
                    ->select('id', 'code', 'name', 'flag_photo_path')
                    ->get()
                    ->map(fn($l) => [
                        'id' => $l->id,
                        'code' => $l->code,
                        'name' => $l->name,
                        'flag_photo_path' => $l->flag_photo_path
                    ]),
            ];
        });
    }
}

if (!function_exists('clearTranslationCache')) {
    function clearTranslationCache() {
        $store = getCacheStore();

        // Clear active languages cache
        $store->forget('active_languages');

        $store->forget('route_translations');

        // Clear car properties cache
        $store->forget('all_car_properties_info');
        $store->forget('all_segments');
        $store->forget('all_body_types');
        $store->forget('all_fuels');
        $store->forget('all_transmissions');

        // Clear route translations for all locales
        $languages = Language::pluck('code')->toArray();
        foreach ($languages as $code) {
            $store->forget("all_route_translations_{$code}");
            $store->forget("translations_{$code}");
        }
    }
}
