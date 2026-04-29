<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function showAdminPage()
    {
        $blogs = Blog::all();
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

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|json',
            'content' => 'required|json',
            'meta_title' => 'required|json',
            'meta_description' => 'required|json',
            'meta_keywords' => 'required|json',
            'slug' => 'required|json',
            'is_active' => 'required|boolean',
            'cover_image' => 'nullable|image|mimes:jpeg,jpg,png,gif,bmp,webp|max:10240',
        ]);

        $blog = Blog::findOrFail($id);
        $slugs = json_decode($validated['slug'], true);
        $languages = \App\Models\Language::all();

        foreach ($slugs as $lang => $slug) {
            $language = $languages->where('code', $lang)->first();
            if (!$language) continue;

            $exists = \App\Models\Translation::join('translation_keys', 'translations.translation_key_id', '=', 'translation_keys.id')
                ->where('translations.language_id', $language->id)
                ->where('translations.value', $slug)
                ->where('translation_keys.key', 'like', 'address.blog-%')
                ->where('translation_keys.id', '!=', $blog->slug_translation_key_id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => "{$lang} dili için girilen slug değeri zaten mevcut."
                ], 422);
            }
        }

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            $translationKey = \App\Models\TranslationKey::find($blog->slug_translation_key_id);

            foreach ($slugs as $lang => $slug) {
                $language = $languages->where('code', $lang)->first();
                if ($language) {
                    \App\Models\Translation::updateOrCreate(
                        ['translation_key_id' => $translationKey->id, 'language_id' => $language->id],
                        ['value' => $slug]
                    );
                }
            }

            if ($request->hasFile('cover_image')) {
                if ($blog->cover_photo_path) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($blog->cover_photo_path);
                }
                $blog->cover_photo_path = $request->file('cover_image')->store('blog_images', 'public');
            }

            $blog->title = json_decode($validated['title'], true);
            $blog->content = json_decode($validated['content'], true);
            $blog->meta_title = json_decode($validated['meta_title'], true);
            $blog->meta_description = json_decode($validated['meta_description'], true);
            $blog->meta_keywords = json_decode($validated['meta_keywords'], true);
            $blog->is_active = $validated['is_active'];
            $blog->save();

            \Illuminate\Support\Facades\DB::commit();

            clearTranslationCache();

            return response()->json([
                'success' => true,
                'message' => 'Blog başarıyla güncellendi.',
            ], 200);

        } catch (\Exception $exception) {
            \Illuminate\Support\Facades\DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Güncelleme işlemi sırasında sistemsel bir hata oluştu.',
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
        $blog = \App\Models\Blog::with('translationKey.translations')->where('is_active', true)
            ->whereHas('translationKey.translations', function ($query) use ($slug) {
                $query->where('value', $slug);
            })
            ->first();
        if($blog)
            return Inertia::render('IndexBlog', ['blog' => $blog]);
        else
            return Inertia::render('NotFound')->toResponse(request())->setStatusCode(404);
    }

    public function showAdminIndexBlog($id){
        $blog = \App\Models\Blog::findOrFail($id);
        $translations = $blog->translationKey->translations;
        $slugs = getActiveLanguages()->mapWithKeys(fn($lang) => [
            $lang->code => $translations->firstWhere('language_id', $lang->id)?->value ?? ''
        ]);
        $blog->slugs = $slugs;
        return Inertia::render('adminPanel/site/BlogForm', ['blog' => $blog]);
    }
}
