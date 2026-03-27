<?php

use App\Http\Middleware\CheckPageGroupIsActive;
use App\Http\Middleware\DetectBrowserLocale;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withSchedule(function (Schedule $schedule) {
        $schedule->command('currency:sync')
            ->weekdays()
            ->dailyAt('15:35')
            ->timezone('Europe/Istanbul');

        $schedule->command('images:clean')
            ->daily()
            ->timezone('Europe/Istanbul');
    })
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'localize'                => \Mcamara\LaravelLocalization\Middleware\LaravelLocalizationRoutes::class,
            'localizationRedirect'    => \Mcamara\LaravelLocalization\Middleware\LaravelLocalizationRedirectFilter::class,
            'localeSessionRedirect'   => \Mcamara\LaravelLocalization\Middleware\LocaleSessionRedirect::class,
            'localeCookieRedirect'    => \Mcamara\LaravelLocalization\Middleware\LocaleCookieRedirect::class,
            'localeViewPath'          => \Mcamara\LaravelLocalization\Middleware\LaravelLocalizationViewPath::class,
            'detectBrowserLocale'     => DetectBrowserLocale::class,
            'admin'                   => \App\Http\Middleware\AdminMiddleware::class,
            'website'                 => \App\Http\Middleware\WebsiteMiddleware::class,
            'check.page.group'        => CheckPageGroupIsActive::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
    })->create();
