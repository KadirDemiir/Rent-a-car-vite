<?php

namespace App\Providers;

use App\Models\Language;
use App\Models\Reservation;
use App\Observers\ReservationObserver;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Bridge\Brevo\Transport\BrevoTransportFactory;
use Symfony\Component\Mailer\Transport\Dsn;

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
        Reservation::observe(ReservationObserver::class);
        Mail::extend('brevo', function () {
            return (new BrevoTransportFactory)->create(
                new Dsn(
                    'brevo+api',
                    'default',
                    config('services.brevo.key')
                )
        );
        });
        $this->configureSupportedLocales();
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }

    /**
     * Dil ayarlarını yapılandırır ve önbelleğe alır.
     */
    protected function configureSupportedLocales(): void
    {
        if (!$this->app->runningInConsole()) {
            
            try {
                $supported = Cache::store('file')->remember('supported_locales', 3600 * 24, function () {
                    // Veritabanı sorgusu SADECE cache yoksa çalışır
                    $langs = getActiveLanguages();

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

            } catch (\Exception $e) {
                // Eğer henüz tablolar oluşmamışsa (ilk kurulumda) uygulama patlamasın diye sessizce geç.
                // Log::error('Dil yapılandırma hatası: ' . $e->getMessage());
            }
        }
    }
}