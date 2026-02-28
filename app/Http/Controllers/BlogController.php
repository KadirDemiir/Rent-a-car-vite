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

        foreach ($slugs as $lang => $slug) {
            $exists = \App\Models\Blog::where("slug->{$lang}", $slug)->exists();

            if ($exists) throw \Illuminate\Validation\ValidationException::withMessages(['slug' => "{$lang} dili için girilen slug değeri zaten mevcut."]);
        }
        try {
            $path = $request->file('cover_image') ? $request->file('cover_image')->store('blog_images', 'public') : null;

            $newBlog = new \App\Models\Blog();
            $newBlog->slug = json_decode($validated['slug'], true);
            $newBlog->title = json_decode($validated['title'], true);
            $newBlog->content = json_decode($validated['content'], true);
            $newBlog->meta_title = json_decode($validated['meta_title'], true);
            $newBlog->meta_description = json_decode($validated['meta_description'], true);
            $newBlog->meta_keywords = json_decode($validated['meta_keywords'], true);
            $newBlog->cover_photo_path = $path;
            $newBlog->is_active = true;
            $newBlog->save();
            return response()->json([
                'success' => true,
            ], 200);

        } catch (\Exception $exception) {
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
        return Inertia::render('Blog', ['blogs' => Blog::where('is_active', true)->get()]);
    }

    public function showIndexBlog($slug)
    {
        \Illuminate\Support\Facades\Log::info($slug);
        $locale = app()->getLocale();
        $blog = Blog::where("slug->{$locale}", $slug)->firstOrFail();
        \Illuminate\Support\Facades\Log::info($blog);
        return Inertia::render('IndexBlog', ['blog' => $blog]);
    }
}
