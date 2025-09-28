<?php

namespace App\Http\Controllers;

use App\Models\ExtraServices;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExtraServicesController extends Controller
{
    public function showAll(){
        $extraServices = ExtraServices::all();
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
            'one_three_day_price' => "required|numeric",
            'currency' => "required|string|max:3",
            'four_seven_day_price' => "required|numeric",
            'eight_fifteen_day_price' => "required|numeric",
            'more_than_fifteen_day_price' => "required|numeric",
            'stock' => "required|numeric",
            'max_limit' => "required|numeric",
        ]);

        try {
            $extraService = ExtraServices::updateOrCreate(
                ['id' => $validated['id'] ?? null],
                [
                    'name' => $validated['name'],
                    'description' => $validated['description'],
                    'one_three_day_price' => $validated['one_three_day_price'],
                    'four_seven_day_price' => $validated['four_seven_day_price'],
                    'eight_fifteen_day_price' => $validated['eight_fifteen_day_price'],
                    'more_than_fifteen_day_price' => $validated['more_than_fifteen_day_price'],
                    'max_limit' => $validated['max_limit'],
                    'currency' => $validated['currency'],
                    'stock' => $validated['stock'],
                ]
            );

            if ($extraService->wasRecentlyCreated) {
                return redirect()->route('adminShowExternalServices')->with('success', 'Yeni Servis Eklendi.');
            } else {
                return redirect()->route('adminShowExternalServices')->with('success', 'Servis Güncellendi.');
            }
        } catch (\Exception $exception) {
            return redirect()->route('adminShowExternalServices')->with('error', $exception->getMessage());
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
        }catch (\Exception $exception){
            return redirect()->route('adminShowExternalServices')->with('error', $exception->getMessage());
        }

    }

}
