<?php

namespace App\Http\Controllers;

use App\Models\BodyType;
use App\Models\Language;
use App\Models\Translation;
use App\Models\TranslationKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BodyTypeController extends Controller
{
    public function addBodyType(Request $request)
    {
        try {
            $validated = $request->validate([
                'names' => 'required',
            ]);

            DB::beginTransaction();
            $bodyType = BodyType::create([
                'translation_key_id' => null
            ]);
            $translationKey = TranslationKey::create([
                "key" => "body_type.{$bodyType->id}"
            ]);
            $bodyType->update([
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
                $updatedTranslations[$language->id] = ['value' => $value['value']];
            }
            DB::commit();
            Log::info('bt', ['deger' => $updatedTranslations]);
            return response()->json([
                'success' => true,
                'body_type_id' => $bodyType->id,
                'translations' => $updatedTranslations
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

    public function updateBodyType(Request $request, $id){
        try {
            $validated = $request->validate([
                'names' => 'required',
            ]);

            DB::beginTransaction();
            $bt = BodyType::findOrFail($id);

            $names = json_decode($validated['names'], true);
            $updatedTranslations = [];

            foreach ($names as $lang => $value) {
                $languageId = Language::where('code', $lang)->first()->id;
                $translation = Translation::where('translation_key_id', $bt->translation_key_id)->where('language_id', $languageId)->first();
                $translation->update(['value' => $value['value']]);
                $updatedTranslations[$languageId] = ['value' => $value['value']];
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'body_type_id' => $id,
                'translations' => $updatedTranslations
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

}
