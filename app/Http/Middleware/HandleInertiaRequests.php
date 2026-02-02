<?php
namespace App\Http\Middleware;

use App\Services\CurrencyService;
use App\Services\TranslationService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'currencies' => fn () => (new CurrencyService())->getActiveCurrencies(),
            'locale' => app()->getLocale(),
            'active_translation' => fn () => TranslationService::getTranslationsByLanguage(app()->getLocale()),
            'translations' => fn () => TranslationService::getAllTranslations(),
            'languages' => fn () => TranslationService::getActiveLanguages(),
        ]);
    }
}
