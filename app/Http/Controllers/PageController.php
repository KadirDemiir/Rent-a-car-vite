<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Page;

class PageController extends Controller
{
    public function showPage()
    {
        return Inertia::render('adminPanel/site/Pages');
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
