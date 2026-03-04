<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function showAdminPage()
    {
        $blogs = Blog::where('is_active', true)->get();
        return Inertia::render('adminPanel/site/BlogPage', [
            'blogs' => $blogs
        ]);
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|json',
            'content' => 'required|json',
            'meta_title' => 'required|json',
            'meta_description' => 'required|json',
            'meta_keywords' => 'required|json',
            'slug' => 'required|json',
            'cover_image' => 'nullable|image|mimes:jpeg,jpg,png,gif,bmp,webp|max:10240',
        ]);
        $slugs = json_decode($validated['slug'], true);
        $languages = \App\Models\Language::all();
        foreach ($slugs as $lang => $slug) {
            $language = $languages->where('code', $lang)->first();
            $exists = \App\Models\Translation::join('translation_keys', 'translations.translation_key_id', '=', 'translation_keys.id')
                ->where('translations.language_id', $language->id)
                ->where('translations.value', $slug)
                ->where('translation_keys.key', 'like', 'address.blog-%')
                ->exists();
            if ($exists) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'slug' => "{$lang} dili için girilen slug değeri zaten mevcut."
                ]);
            }
        }
        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            $keyString = 'address.blog-' . \Illuminate\Support\Str::lower(\Illuminate\Support\Str::random(8));

            $translationKey = \App\Models\TranslationKey::create([
                'key' => $keyString
            ]);

            foreach ($slugs as $lang => $slug) {
                $language = $languages->where('code', $lang)->first();

                if ($language) {
                    \App\Models\Translation::create([
                        'translation_key_id' => $translationKey->id,
                        'language_id' => $language->id,
                        'value' => $slug
                    ]);
                }
            }
            $path = $request->file('cover_image') ? $request->file('cover_image')->store('blog_images', 'public') : null;

            $newBlog = new \App\Models\Blog();
            $newBlog->slug_translation_key_id = $translationKey->id;
            $newBlog->title = json_decode($validated['title'], true);
            $newBlog->content = json_decode($validated['content'], true);
            $newBlog->meta_title = json_decode($validated['meta_title'], true);
            $newBlog->meta_description = json_decode($validated['meta_description'], true);
            $newBlog->meta_keywords = json_decode($validated['meta_keywords'], true);
            $newBlog->cover_photo_path = $path;
            $newBlog->is_active = true;
            $newBlog->save();
            \Illuminate\Support\Facades\DB::commit();

            clearTranslationCache();
            return response()->json([
                'success' => true,
            ], 200);

        } catch (\Exception $exception) {
            \Illuminate\Support\Facades\DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Kayıt işlemi sırasında sistemsel bir hata oluştu.',
                'error' => config('app.debug') ? $exception->getMessage() : null,
            ], 500);
        }
    }

    public function showAdminAddPage()
    {
        return Inertia::render('adminPanel/site/BlogForm');
    }

    public function showBlogs()
    {
        return Inertia::render('Blog', [
            'blogs' => Blog::with('translationKey:id,key', 'translationKey.translations')
                ->where('is_active', true)
                ->get()
        ]);
    }

    public function showIndexBlog($slug)
    {
        $blog = \App\Models\Blog::with('translationKey.translations')
            ->whereHas('translationKey.translations', function ($query) use ($slug) {
                $query->where('value', $slug);
            })
            ->first();
        if($blog)
            return Inertia::render('IndexBlog', ['blog' => $blog]);
        else
            return Inertia::render('NotFound')->toResponse(request())->setStatusCode(404);
    }
}
