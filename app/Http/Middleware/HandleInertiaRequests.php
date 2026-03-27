<?php
namespace App\Http\Middleware;

use App\Services\TranslationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    // Request-level caching to avoid repeated lookups within same request
    private static ?array $cachedCurrencies = null;
    private static ?array $cachedLanguages = null;
    private static array $cachedTranslations = [];

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
            'currencies' => fn () => $this->getCurrencies(),
            'locale' => app()->getLocale(),
            'languages' => fn () => $this->getLanguages(),
            // Pass translations inline to avoid extra HTTP request from i18next
            'pageName' => getPagesNameCache(),
            'translations' => fn () => $this->getTranslations($request),
            'activePages' => getPagesCache()->where('is_active', true)->pluck('route_group_name')->toArray(),
        ]);
    }

    /**
     * Get currencies with request-level caching
     */
    private function getCurrencies(): array
    {
        if (self::$cachedCurrencies === null) {
            self::$cachedCurrencies = Cache::get('active_currencies_simple') ?? $this->refreshCurrencies();
        }
        return self::$cachedCurrencies;
    }

    /**
     * Refresh currencies from DB
     */
    private function refreshCurrencies(): array
    {
        $currencies = \App\Models\Currency::where('is_active', 1)
            ->select('id', 'code', 'symbol', 'exchange_rate')
            ->get()
            ->toArray();

        Cache::put('active_currencies_simple', $currencies, 3600);
        return $currencies;
    }

    /**
     * Get languages with request-level caching
     */
    private function getLanguages(): array
    {
        if (self::$cachedLanguages === null) {
            self::$cachedLanguages = TranslationService::getActiveLanguages();
        }
        return self::$cachedLanguages;
    }

    /**
     * Get translations with request-level caching
     * Passed inline via props to avoid extra HTTP request
     */
    private function getTranslations(Request $request): array
    {
        $scope = $this->resolveTranslationScope($request);
        $cacheKey = app()->getLocale() . '|' . $scope;

        if (!array_key_exists($cacheKey, self::$cachedTranslations)) {
            $translations = TranslationService::getTranslationsByLanguage(app()->getLocale());
            
            if ($scope === 'admin') {
                // For admin, exclude anything starting with website.
                self::$cachedTranslations[$cacheKey] = collect($translations)
                    ->filter(fn ($value, $key) => !Str::startsWith($key, 'website.'))
                    ->toArray();
            } else {
                // For website, exclude anything starting with adminpanel.
                self::$cachedTranslations[$cacheKey] = collect($translations)
                    ->filter(fn ($value, $key) => !Str::startsWith($key, 'adminpanel.'))
                    ->toArray();
            }
        }

        return self::$cachedTranslations[$cacheKey];
    }

    /**
     * Determine whether request is in website or admin area.
     */
    private function resolveTranslationScope(Request $request): string
    {
        $route = $request->route();
        $routeMiddlewares = $route?->gatherMiddleware() ?? [];
        $routeName = $route?->getName() ?? '';

        if (in_array('admin', $routeMiddlewares, true) || Str::startsWith($routeName, 'admin')) {
            return 'admin';
        }

        return 'website';
    }
}
