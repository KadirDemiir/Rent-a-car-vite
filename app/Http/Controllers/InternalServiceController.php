<?php

namespace App\Http\Controllers;

use App\Models\InternalService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use function Laravel\Prompts\error;

class InternalServiceController extends Controller
{
    public function showAll(){
        $internalServices = InternalService::all();
        return Inertia::render('adminPanel/additionalServices/InternalServices', [
            'services' => $internalServices,
            'success' => session('success'),
            'error' => session('error')
        ]);
    }
    public function addInternalService(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|json',
            'description' => 'required|json',
        ]);

        try {
            $internalServices = InternalService::updateOrCreate([
                'id' => $validated['id'] ?? null,
            ],
            [
                'name' => $validated['name'],
                'description' => $validated['description'],
            ]
            );
            if ($internalServices->wasRecentlyCreated) {
                return response()->json(['success' => 1, 'services' => InternalService::all()]);
            } else {
                return response()->json(['update' => 1, 'services' => InternalService::all()]);
            }
        } catch (\Exception $exception) {
            return response()->json('error', $exception->getMessage());
        }
    }

    public function deleteService(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:internal_services,id',
        ]);
        try {
            InternalService::findOrFail($validated['id'])->delete();
            return response()->json(['success' => 1, 'services' => InternalService::all()->fresh()]);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()]);
        }
    }
}
