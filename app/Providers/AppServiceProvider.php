<?php

namespace App\Providers;

use App\Models\Language;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'auth' => [
                'user' => fn () => Auth::check() ? Auth::user() : null,
            ],
        ]);

        $this->configureSupportedLocales();
    }

    /**
     */
    protected function configureSupportedLocales(): void
    {
        if (!$this->app->runningInConsole() && Schema::hasTable('languages')) {

            $supported = Cache::remember('supported_locales', 60 * 60 * 24, function () {
                $langs = Language::where('status', 'active')->get();

                return $langs->mapWithKeys(fn($lang) => [
                    $lang->code => [
                        'name'     => $lang->name,
                        'script'   => 'Latn',
                        'native'   => $lang->native ?? $lang->name,
                        'regional' => $lang->code . '_' . strtoupper($lang->code),
                    ]
                ])->toArray();
            });

            config(['laravellocalization.supportedLocales' => $supported]);
        }
    }
}
