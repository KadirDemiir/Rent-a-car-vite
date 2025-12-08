<?php

namespace App\Http\Controllers;
use App\Models\Currency;
use App\Models\DropPrice;
use App\Models\Locations;
use App\Models\Segment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DropPriceController extends Controller
{
    public function showAdminDropPrice()
    {
        $dropPrice = DropPrice::all();
        $locations = Locations::all();
            $segments = Segment::all();
            $currencies = Currency::where('is_active', 1)->get();
        return Inertia::render('adminPanel/price/DropPrice', [
            'dropPrice' => $dropPrice,
            'locations' => $locations,
            'segments' => $segments,
            'currencies' => $currencies,
            'success' => session('success')
        ]);
    }

    public function addDropPrice(Request $request){
        if($request->type === "locations_price"){
            return $this->updateDropPrice($request);
        }
        else if ($request->type === "segment_coefficient"){
            return $this->updateSegmentCoefficient($request);
        }
        else
            return redirect()->back()->withErrors([
                'general' => 'Fiyatlar güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
            ]);
    }

    public function updateDropPrice(Request $request){
        try {
            $validatedData = $request->validate([
                'pickup_location_id' => 'required|int',
                'locations' => 'required|json',
                'currency' => 'required|string|max:3',
            ]);
            $locations = json_decode($validatedData['locations'], true);
            if (!$locations || !is_array($locations)) {
                return redirect()->back()->withErrors(['locations' => 'Lokasyon verisi geçersiz.']);
            }
            foreach($locations as $location){
                DropPrice::updateOrCreate([
                    'from_location_id' => $validatedData['pickup_location_id'],
                    'to_location_id' => $location['id'],
                ], [
                    'price' => $location['value'],
                    'currency' => $validatedData['currency'],
                ]);
            }
            return redirect()->route('adminShowDropPrice')->with('success', 'Fiyatlar başarıyla güncellendi.');
        } catch (\Exception $e) {
            Log::error('Drop price update error: '.$e->getMessage());
            return redirect()->back()->withErrors([
                'general' => 'Fiyatlar güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
            ]);
        }
    }

    public function updateSegmentCoefficient(Request $request){
        try {
            $validatedData = $request->validate([
                'coefficients' => 'required|json',
            ]);
            $coeffs = json_decode($validatedData['coefficients'], true);
            foreach ($coeffs as $segmentName => $segmentData) {
                Segment::updateOrCreate(
                    ['name' => $segmentName],
                    ['coefficient' => $segmentData['value']]
                );
            }
            return redirect()->route('adminShowDropPrice')->with('success', 'Fiyatlar başarıyla güncellendi.');
        } catch (\Exception $e) {
            Log::error('Drop price update error: '.$e->getMessage());
            return redirect()->back()->withErrors([
                'general' => 'Fiyatlar güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
            ]);
        }

    }
}
