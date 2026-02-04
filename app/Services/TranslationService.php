<?php

namespace App\Services;

use App\Models\Language;
use App\Models\Translation;
use Illuminate\Support\Facades\Cache;

class TranslationService
{
    /**
     * Belirli bir dil için çevirileri Cache veya DB'den çeker.
     * API üzerinden çağrıldığında bu metod kullanılır.
     */
    public static function getTranslationsByLanguage(string $langCode): array
    {
        $cacheKey = "translations_{$langCode}";
        $cacheDuration = 3600 * 24 * 30; 

        return Cache::remember($cacheKey, $cacheDuration, function () use ($langCode) {
            return Translation::with('translationKey')
                ->whereHas('language', fn($q) => $q->where('code', $langCode))
                ->get()
                ->mapWithKeys(function ($t) {
                    return [$t->translationKey->key => $t->value];
                })
                ->toArray();
        });
    }

    public static function getActiveLanguages(): array
    {
        return Cache::remember('active_languages_list', 3600 * 24 * 30, function () {
            return Language::where('status', 'active')
                ->select('id', 'code', 'name', 'flag_photo_path') // Sadece gerekli alanları çekiyoruz
                ->get()
                ->toArray();
        });
    }

    /**
     * Admin panelinde çeviri güncellendiğinde Cache'i temizler.
     */
    public static function clearCache(): void
    {
        $languages = Language::pluck('code')->toArray();
        
        foreach ($languages as $code) {
            Cache::forget("translations_{$code}");
        }
        
        Cache::forget('active_languages_list');
    }
}