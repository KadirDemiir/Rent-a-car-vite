<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

use App\Models\Page;

class PageController extends Controller
{
    public function showPage()
    {
        return Inertia::render('adminPanel/site/Pages');
    }

    public function showSortPage()
    {
        return Inertia::render('adminPanel/site/NavigationOperator');
    }

    public function getPages()
    {
        $pages = Page::where('is_system', false)->select('id', 'title', 'sort_order')->orderBy('sort_order', 'asc')->get()->values();
        //\Illuminate\Support\Facades\Log::info('Fetched pages for admin panel', ['pages_count' => $pages->count()]);
        return response()->json(['pages' => $pages]);
    }

    public function updateSort(Request $request){
        Log::info('message => ', $request->all());
        $request->validate([
        'pages' => 'required|array',
        'pages.*.id' => 'required|exists:pages,id',
        'pages.*.sort_order' => 'required|integer',
    ]);

    DB::beginTransaction();

    try {
        foreach ($request->pages as $page) {
            Page::where('id', $page['id'])->update([
                'sort_order' => $page['sort_order']
            ]);
        }
        clearPageNameCache();
        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Sıralama başarıyla güncellendi.'
        ], 200);

    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'success' => false,
            'message' => 'Sıralama güncellenirken bir hata oluştu.',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function index()
    {
        $pages = Page::all();
        return response()->json($pages);
    }

    public function toggleStatus($id)
    {
        $page = Page::findOrFail($id);
        $page->is_active = !$page->is_active;
        $page->save();
        \Cache::forget('pages_cache');
        return response()->json(['success' => true, 'is_active' => $page->is_active]);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|array',
            'meta_title' => 'nullable|array',
            'meta_description' => 'nullable|array',
            'meta_keywords' => 'nullable|array',
            'is_active' => 'boolean',
        ]);
        $page->update($validated);
        \Cache::forget('pages_cache');
        return response()->json(['success' => true, 'page' => $page]);
    }

}
