<?php

use Illuminate\Support\Facades\Schema;
use App\Models\Translation;

if (!function_exists('dbTransRoute')) {
    function dbTransRoute(string $key): ?string
    {
        $locale = app()->getLocale();

        // 🚦 tablo yoksa direkt null dön
        if (!Schema::hasTable('translations') || !Schema::hasTable('languages')) {
            return null;
        }

        return Translation::with(['translationKey', 'language'])
            ->whereHas('translationKey', fn($q) => $q->where('key', "address.{$key}"))
            ->whereHas('language', fn($q) => $q->where('code', $locale))
            ->first()?->value;
    }
}
