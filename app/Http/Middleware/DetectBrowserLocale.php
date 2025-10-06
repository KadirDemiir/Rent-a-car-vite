<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

class DetectBrowserLocale
{
    public function handle(Request $request, Closure $next)
    {

        $browserLocale = $request->getPreferredLanguage();

        if ($browserLocale && in_array($browserLocale, LaravelLocalization::getSupportedLanguagesKeys()) && !session()->has('locale')) {

            session()->put('locale', $browserLocale);
            App::setLocale($browserLocale);

            LaravelLocalization::setLocale($browserLocale);
        }

        return $next($request);
    }
}
