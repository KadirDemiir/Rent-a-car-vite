<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Exception;

class SectionController extends Controller
{
    public function showPage()
    {
        return Inertia::render('adminPanel/site/Sections', ['sections' => getSectionsCache()]);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'source' => 'required|string'
        ]);

        $file = $request->file('image');
        $source = Str::slug($request->input('source'));
        $hash = md5_file($file->getRealPath());
        $extension = $file->getClientOriginalExtension();
        $fileName = $hash . '.' . $extension;

        $path = $file->storeAs("uploads/{$source}", $fileName, 'public');

        return response()->json([
            'url' => asset("storage/{$path}")
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'page_id' => 'required|exists:pages,id',
            'description' => 'required|string',
            'title' => 'required|array',
            'content' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        try {
            $maxSortOrder = Section::where('page_id', $request->input('page_id'))->max('sort_order');

            $section = Section::create([
                'page_id' => $request->input('page_id'),
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'content' => $request->input('content'),
                'sort_order' => $maxSortOrder !== null ? $maxSortOrder + 1 : 0,
                'is_active' => $request->has('is_active') ? $request->boolean('is_active') : true,
                'is_default' => false,
            ]);

            Cache::forget('sections_cache');

            return response()->json($section, 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Kayıt işlemi başarısız oldu.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|array',
            'description' => 'required|string',
            'content' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        try {
            $section = Section::findOrFail($id);

            $section->update([
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'content' => $request->input('content'),
                'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $section->is_active,
            ]);

            Cache::forget('sections_cache');

            return response()->json($section);
        } catch (Exception $e) {
            return response()->json(['error' => 'Güncelleme işlemi başarısız oldu.'], 500);
        }
    }

    private function deleteContentImages($content)
    {
        if (!is_array($content)) return;

        foreach ($content as $html) {
            if (empty($html)) continue;

            $dom = new \DOMDocument();
            libxml_use_internal_errors(true);
            $dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

            $images = $dom->getElementsByTagName('img');

            foreach ($images as $img) {
                $src = $img->getAttribute('src');

                if (str_contains($src, '/storage/uploads/sections/')) {
                    $path = str_replace('/storage/', '', $src);
                    if (Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                }
            }
        }
    }

    public function destroy($id)
    {
        try {
            $section = Section::findOrFail($id);

            if ($section->is_default) {
                return response()->json(['error' => 'Sistem bölümleri silinemez.'], 403);
            }

            $this->deleteContentImages($section->content);

            $section->delete();

            Cache::forget('sections_cache');

            return response()->json(null, 204);
        } catch (Exception $e) {
            return response()->json(['error' => 'Silme işlemi başarısız oldu.'], 500);
        }
    }

    public function reorderSections(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:sections,id',
            'items.*.sort_order' => 'required|integer',
        ]);

        try {
            DB::transaction(function () use ($request) {
                foreach ($request->input('items') as $item) {
                    Section::where('id', $item['id'])->update([
                        'sort_order' => $item['sort_order']
                    ]);
                }
            });

            Cache::forget('sections_cache');

            return response()->json(['success' => true]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Sıralama işlemi başarısız oldu.'], 500);
        }
    }
}
