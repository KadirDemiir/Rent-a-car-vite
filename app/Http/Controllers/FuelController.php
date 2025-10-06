<?php

namespace App\Http\Controllers;

use App\Models\BodyType;
use App\Models\Fuel;
use App\Models\Language;
use App\Models\Translation;
use App\Models\TranslationKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FuelController extends Controller
{
    public function addFuel(Request $request){
        try {
            $validated = $request->validate([
                'names' => 'required',
            ]);

            DB::beginTransaction();
            $fuel = Fuel::create([
                'translation_key_id' => null
            ]);
            $translationKey = TranslationKey::create([
                "key" => "fuel.{$fuel->id}"
            ]);
            $fuel->update([
                'translation_key_id' => $translationKey->id
            ]);
            $names = json_decode($validated['names'], true);
            $updatedTranslations = [];
            foreach ($names as $lang => $value) {
                $language = Language::where('code', $lang)->first();
                Translation::create([
                    'translation_key_id' => $translationKey->id,
                    'language_id' => $language->id,
                    'value' => $value['value']
                ]);
                $updatedTranslations[$language->id] = $value['value'];
            }
            DB::commit();
            return response()->json([
                'success' => true,
                'transmissions' => $updatedTranslations,
                'fuel_id' => $fuel->id
            ]);

        } catch (\Exception $exception) {
            DB::rollBack();
            Log::error('AddBodyType Error', [
                'message' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'request' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    public function updateFuel(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'names' => 'required',
            ]);

            DB::beginTransaction();

            $fuel = Fuel::findOrFail($id);
            $names = json_decode($validated['names'], true);

            $updatedTranslations = [];

            foreach ($names as $lang => $value) {
                $language = Language::where('code', $lang)->firstOrFail();

                $translation = Translation::where('translation_key_id', $fuel->translation_key_id)->where('language_id', $language->id)->first();

                if ($translation) {
                    $translation->update(['value' => $value['value']]);
                } else {
                    $translation = Translation::create([
                        'translation_key_id' => $fuel->translation_key_id,
                        'language_id' => $language->id,
                        'value' => $value['value']
                    ]);
                }
                $updatedTranslations[$language->id] = ['value' => $translation->value];
            }
            DB::commit();

            return response()->json([
                'success' => true,
                'fuel_id' => $id,
                'translations' => $updatedTranslations
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

}
