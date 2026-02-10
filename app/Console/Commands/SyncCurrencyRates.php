<?php

namespace App\Console\Commands;

use App\Models\Currency;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncCurrencyRates extends Command
{
    protected $signature = 'currency:sync';
    protected $description = 'Sync currency exchange rates from TCMB';

    public function handle(): int
    {
        $this->info('Syncing currency rates from TCMB...');

        $def = Currency::where('is_active', 1)->where('is_default', 1)->first();

        if (!$def) {
            $this->error('Default currency not found');
            return Command::FAILURE;
        }

        try {
            $response = Http::retry(3, 100)->timeout(15)->get('https://www.tcmb.gov.tr/kurlar/today.xml');

            if ($response->failed()) {
                throw new \Exception('TCMB request failed');
            }

            $xml = simplexml_load_string($response->body());

            if ($xml === false) {
                throw new \Exception('Invalid XML response');
            }

            $tcmbRates = collect();
            foreach ($xml->Currency as $c) {
                $tcmbRates->push([
                    'code' => (string)$c['CurrencyCode'],
                    'forexBuying' => (float)str_replace(',', '.', (string)$c->ForexBuying),
                ]);
            }

            $defCode = strtoupper($def->code);

            $defRateItem = $tcmbRates->firstWhere('code', $defCode);
            $baseRate = $defCode === 'TRY' ? 1 : ($defRateItem['forexBuying'] ?? 1);

            $myCurrs = Currency::where('is_active', 1)->get();
            $updated = 0;

            foreach ($myCurrs as $curr) {
                $currCode = strtoupper($curr->code);

                if ($currCode === 'TRY') {
                    $targetRateTRY = 1;
                } else {
                    $rateItem = $tcmbRates->firstWhere('code', $currCode);
                    $targetRateTRY = $rateItem['forexBuying'] ?? 1;
                }

                $exchangeRate = $baseRate / $targetRateTRY;

                $curr->update(['exchange_rate' => round($exchangeRate, 8)]);
                $updated++;
            }

            $simpleCurrencies = Currency::where('is_active', 1)
                ->select('id', 'code', 'symbol', 'exchange_rate')
                ->get()
                ->toArray();

            Cache::put('active_currencies_simple', $simpleCurrencies, 86400);
            Cache::forget('active_currencies');

            $this->info("Successfully updated {$updated} currencies");
            Log::info("Currency rates synced: {$updated} currencies updated");

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error('Failed to sync: ' . $e->getMessage());
            Log::error('Currency sync failed: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
