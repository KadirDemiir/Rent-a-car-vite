<?php

namespace App\Http\Controllers;

use App\Models\Language;
use App\Models\Photo;
use App\Models\Translation;
use App\Models\TranslationKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TranslationController extends Controller
{
    public function __construct(
        protected \App\Services\TranslationService $translationService
    ) {}

    public function addLanguage(Request $request){
        try {
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|size:2|unique:languages,code',
            'flag' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'keys' => 'required|json'
        ]);
        DB::beginTransaction();
            $photo_path = $validated['flag']->store('flags', 'public');
            $language = Language::create([
                'name' => $validated['name'],
                'code' => $validated['code'],
                'flag_photo_path' => $photo_path,

            ]);

            $keys = json_decode($validated['keys'], true);
            foreach ($keys as $key => $data) {
                $translation_id =  TranslationKey::where('key', $key)->first()->id;;
                Translation::create([
                   'language_id' => $language->id,
                   'translation_key_id' => $translation_id,
                   'value' => $data['value'],
                ]);
            }
            DB::commit();
            $this->translationService->clearCache();
                return response()->json(['success' => 'New Language Add Successfully', 'id' => $language->id]);
        }catch (\Exception $exception){
            DB::rollBack();
            Log::error($exception);
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function setActiveLanguage(Request $request, $id){
        /*Log::info('Request status value:', ['status' => $request->input('status')]);*/
        try {
            $validated = $request->validate([
                'status' => 'required',
            ]);
            $language = Language::with('translations')->findOrFail($id);
            $language->status = $validated['status'];
            $language->save();
            clearTranslationCache();

            $message = $language->status == "active"
                ? 'Language activated successfully.'
                : 'Language deactivated successfully.';

            return response()->json([
                'success' => $message,
                'language' => $language,
                ]);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function updateLanguage(Request $request, $id){
        /*Log::info('Request:', ['flag' => $request->input('flag')]);*/
        try {
            $validated = $request->validate([
                'name' => 'required|string',
                'code' => 'required|string|size:2|exists:languages,code',
                'flag' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);
            DB::beginTransaction();
            $lang = Language::where('id', $id)->first();
            $lang->name = $validated['name'];
            if(isset($validated['flag'])    )
                $lang->flag_photo_path =  $validated['flag']->store('flags', 'public');
            $lang->save();
            DB::commit();
            $this->translationService->clearCache();
            return response()->json(['success' => 'Language Updated Successfully']);
        }catch (\Exception $exception){
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    public function deleteLanguage(Request $request, $id){
        try {
            $languageCount = Language::count();
            if ($languageCount <= 1)
                return response()->json(['error' => 'At least one language must remain. Deletion is not allowed.'], 400);
            $language = Language::findOrFail($id);
            if ($language->flag_photo_path && Storage::disk('public')->exists($language->flag_photo_path)) {
                Storage::disk('public')->delete($language->flag_photo_path);
            }
            $language->delete();
            $this->translationService->clearCache();
            return response()->json(['success' => 'Language deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete language: ' . $e->getMessage()], 500);
        }
    }

    public function updateSiteVariable(Request $request, $id){
        /*Log::info('Request:', ['request' => $request->all()]);*/

        try {
            $validated = $request->validate([
                'translations' => 'required',
            ]);
            DB::beginTransaction();
            foreach ($validated['translations'] as $translation) {
                Translation::updateOrCreate(
                    [
                        'language_id' => $id,
                        'translation_key_id' => TranslationKey::where('key', $translation['key'])->first()->id,
                    ],
                    [
                        'value' => $translation['value']
                    ]
                );
            }
            DB::commit();
            $this->translationService->clearCache();
            return response()->json(['success' => 'Language updated successfully.']);
        }catch (\Exception $exception){
            DB::rollBack();
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
