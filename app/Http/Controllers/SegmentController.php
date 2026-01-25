<?php

namespace App\Http\Controllers;

use App\Models\Fuel;
use App\Models\Language;
use App\Models\Segment;
use App\Models\Translation;
use App\Models\TranslationKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SegmentController extends Controller
{
    public function addSegment(Request $request){
        try {
            $validated = $request->validate([
                'names' => 'required',
                'coefficient' => 'required',
            ]);

            DB::beginTransaction();
            $segment = Segment::create([
                'translation_key_id' => null,
                'coefficient' => $validated['coefficient'],
            ]);
            $translationKey = TranslationKey::create([
                "key" => "segment.{$segment->id}"
            ]);
            $segment->update([
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
            clearTranslationCache();
            return response()->json([
                'success' => true,
                'segment_id' => $segment->id,
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

    public function updateSegment(Request $request, $id){
        try {
            $validated = $request->validate([
                'names' => 'required',
                'coefficient' => 'required|numeric',
            ]);

            DB::beginTransaction();
            $segment = Segment::findOrFail($id);
            $segment->update(['coefficient' => $validated['coefficient']]);

            $names = json_decode($validated['names'], true);
            $updatedTranslations = [];

            foreach ($names as $lang => $value) {
                $languageId = Language::where('code', $lang)->first()->id;
                $translation = Translation::where('translation_key_id', $segment->translation_key_id)->where('language_id', $languageId)->first();
                $translation->update(['value' => $value['value']]);
                $updatedTranslations[$languageId] = ['value' => $value['value']];
            }

            DB::commit();
            clearTranslationCache();
            return response()->json([
                'success' => true,
                'segment_id' => $segment->id,
                'translations' => $updatedTranslations
            ]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

}
