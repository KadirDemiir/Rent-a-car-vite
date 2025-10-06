<?php

namespace App\Http\Controllers;

use App\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;

class RouteController extends Controller
{

    protected static $translations;

    public static function initTranslations() {
        if (!self::$translations) {
            self::$translations = Cache::remember('translations', 60000, function () {
                return Translation::with(['translationKey', 'language'])
                    ->whereHas('translationKey', fn($q) => $q->where('key', 'like', 'address%'))
                    ->get()
                    ->groupBy([
                        fn($item) => $item->language->code,
                        fn($item) => $item->translationKey->key
                    ]);
            });
        }
        return self::$translations;
    }
    public static function createUrl(String $path){
        $lang = App::getLocale();
        $translations = self::initTranslations();
        return "/{$translations[$lang]["address.{$path}"][0]->value}";

    }
}
