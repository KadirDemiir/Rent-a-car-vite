<?php

namespace App\Services;

use App\Models\Language;
use App\Models\Translation;
use Illuminate\Support\Facades\Cache;

class TranslationService
{
    /**
     * Get all translations for a specific language from cache or database
     */
    public static function getTranslationsByLanguage(string $langCode): array
    {
        $cacheKey = "translations_{$langCode}";
        $cacheDuration = 3600 * 24; // 24 hours

        return Cache::store('file')->remember($cacheKey, $cacheDuration, function () use ($langCode) {
            return Translation::with('translationKey')
                ->whereHas('language', fn($q) => $q->where('code', $langCode))
                ->get()
                ->mapWithKeys(fn($t) => [$t->translationKey->key => $t->value])
                ->toArray();
        });
    }

    /**
     * Get all active languages with basic info
     */
    public static function getActiveLanguages(): array
    {
        return Cache::store('file')->remember('active_languages_list', 3600 * 24, function () {
            return Language::where('status', 'active')
                ->get(['id', 'code', 'name', 'flag_photo_path'])
                ->toArray();
        });
    }

    /**
     * Get all translations for all languages (useful for i18n config)
     */
    public static function getAllTranslations(): array
    {
        $activeLanguages = self::getActiveLanguages();
        $translations = [];

        foreach ($activeLanguages as $lang) {
            $translations[$lang['code']] = [
                'translation' => self::getTranslationsByLanguage($lang['code'])
            ];
        }

        return $translations;
    }

    /**
     * Clear translation cache when translations are updated
     */
    public static function clearCache(): void
    {
        $languages = Language::pluck('code')->toArray();
        
        foreach ($languages as $code) {
            Cache::store('file')->forget("translations_{$code}");
        }
        
        Cache::store('file')->forget('active_languages_list');
        Cache::store('file')->forget('supported_locales');
    }
}
