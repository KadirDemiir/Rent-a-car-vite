<?php

namespace App\Http\Controllers;

use App\Models\Fuel;
use App\Models\Language;
use App\Models\Translation;
use App\Models\TranslationKey;
use App\Models\Transmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransmissionController extends Controller
{
    public function addTransmission(Request $request){
        try {
            $validated = $request->validate([
                'names' => 'required',
            ]);

            DB::beginTransaction();
            $transmission = Transmission::create(['translation_key_id' => null]);
            $translationKey = TranslationKey::create(["key" => "transmission.{$transmission->id}"]);
            $transmission->update(['translation_key_id' => $translationKey->id]);
            $names = json_decode($validated['names'], true);
            $updateTranslations = [];
            foreach ($names as $lang => $value) {
                $language = Language::where('code', $lang)->first();
                Translation::create([
                    'translation_key_id' => $translationKey->id,
                    'language_id' => $language->id,
                    'value' => $value['value']
                ]);
                $updateTranslations[$language->id] = ['value' => $value['value']];
            }
            DB::commit();
            clearTranslationCache();
            return response()->json([
                'success' => true,
                'transmission_id' => $transmission->id,
                'translations' => $updateTranslations
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

    public function updateTransmission(Request $request, $id){
        try {
            $validated = $request->validate([
                'names' => 'required',
            ]);

            DB::beginTransaction();
            $transmission = Transmission::findOrFail($id);

            $names = json_decode($validated['names'], true);
            $updatedTranslations = [];

            foreach ($names as $lang => $value) {
                $languageId = Language::where('code', $lang)->first()->id;
                $translation = Translation::where('translation_key_id', $transmission->translation_key_id)->where('language_id', $languageId)->first();
                $translation->update(['value' => $value['value']]);
                $updatedTranslations[$languageId] = ['value' => $value['value']];
            }

            DB::commit();
            clearTranslationCache();

            return response()->json([
                'success' => true,
                'transmission_id' => $id,
                'translations' => $updatedTranslations
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
