<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use App\Models\ExtraServicePrice;
use App\Models\ExtraServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExtraServicesController extends Controller
{
    public function showAll(){
        $extraServices = ExtraServices::with('extraServicePrices')->get();
        return Inertia::render('adminPanel/additionalServices/ExtraServices', [
            'extraServices' => $extraServices,
            'success' => session('success'),
            'error' => session('error')
        ]);
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|exists:extra_services,id',
            'name' => "required|json",
            'description' => "required|json",
            'pricing' => "required|json",
            'currency' => "required|int|exists:currencies,id",
            'stock' => "required|numeric",
            'max_limit' => "required|numeric",
        ]);

        try {
            DB::beginTransaction();
            $selectedCurrency = Currency::findOrFail($validated['currency']);
            $rate = $selectedCurrency->exchange_rate;
            $extraService = ExtraServices::updateOrCreate(
                ['id' => $validated['id'] ?? null],
                [
                    'name' => $validated['name'],
                    'description' => $validated['description'],
                    'max_limit' => $validated['max_limit'],
                    'currency_id' => $validated['currency'],
                    'stock' => $validated['stock'],
                    'current_stock' => $validated['stock'],
                ]
            );

            $prices = json_decode($validated['pricing'], true);

            ExtraServicePrice::where('extra_service_id', $extraService->id)->delete();

            foreach ($prices as $price) {
                ExtraServicePrice::create([
                    'currency_id' => $validated['currency'],
                    'extra_service_id' => $extraService->id,
                    'min_days' => $price['min_days'],
                    'max_days' => $price['max_days'],
                    'price' => $price['price'],
                    'base_price' => (float) $price['price'] / $rate,
                ]);
            }

            DB::commit();

            if ($extraService->wasRecentlyCreated) {
                return response()->json(['success' => true]);
            } else {
                return response()->json(['update' => true]);
            }
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:extra_services,id',
        ]);
        try {
            ExtraServices::findOrFail($request->id)->delete();
            return redirect()->route('adminShowExternalServices')->with('success', 'Servis Silindi.');
        } catch (\Exception $exception){
            return redirect()->route('adminShowExternalServices')->with('error', $exception->getMessage());
        }
    }
}
