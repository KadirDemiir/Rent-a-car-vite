<?php

namespace App\Services;

use App\Models\Currency;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CurrencyService
{
    public function getActiveCurrencies()
    {
        return Cache::store('file')->remember('active_currencies', 3600, function () {
            Log::info('CACHE MISS: Fetching from TCMB ' . now());
            
            $def = Currency::where('is_active', 1)->where('is_default', 1)->first();
            
            if (!$def) {
                throw new \Exception('Default currency not found');
            }

            try {
                $response = Http::timeout(5)->get('https://www.tcmb.gov.tr/kurlar/today.xml');
                
                if ($response->failed()) {
                    throw new \Exception('TCMB Unreachable');
                }
                
                $xml = simplexml_load_string($response->body());
                
                if ($xml === false) {
                    throw new \Exception('Invalid XML');
                }

            } catch (\Exception $e) {
                Log::error('Currency fetch error: ' . $e->getMessage());
                return Currency::where('is_active', true)->get();
            }

            $tcmbRates = collect();
            
            foreach ($xml->Currency as $c) {
                $tcmbRates->push([
                    'code' => (string)$c['CurrencyCode'],
                    'forexBuying' => (float)str_replace(',', '.', $c->ForexBuying),
                ]);
            }

            $defCode = strtoupper($def->code);
            
            if ($defCode === 'TRY') {
                $baseRate = 1;
            } else {
                $baseCurrencyData = $tcmbRates->firstWhere('code', $defCode);
                $baseRate = ($baseCurrencyData && !empty($baseCurrencyData['forexBuying']))
                    ? $baseCurrencyData['forexBuying']
                    : 1;
            }

            $myCurrs = Currency::where('is_active', 1)->get();
            
            foreach ($myCurrs as $curr) {
                $currCode = strtoupper($curr->code);
                
                if ($currCode === 'TRY') {
                    $targetRateTRY = 1;
                } else {
                    $tcmbData = $tcmbRates->firstWhere('code', $currCode);
                    $targetRateTRY = $tcmbData ? $tcmbData['forexBuying'] : 1;
                }
                
                $exchangeRate = $baseRate / ($targetRateTRY ?: 1);
                $curr->update(['exchange_rate' => round($exchangeRate, 8)]);
            }

            return $myCurrs;
        });
    }
}