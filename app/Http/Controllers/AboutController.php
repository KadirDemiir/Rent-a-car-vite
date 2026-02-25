<?php

namespace App\Http\Controllers;

use App\Models\About;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutController extends Controller
{

    public function show()
    {
        return Inertia::render('About', [
            'about_info' => About::first()
        ]);
    }
    public function showPage()
    {
        return Inertia::render('adminPanel/site/AboutPage', [
            'about_info' => About::first()
        ]);
    }

    public function add(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|array',
                'content' => 'required|array',
            ]);

            About::updateOrCreate(
                ['id' => 1],
                [
                    'title' => $validated['title'],
                    'content' => $validated['content'],
                ]
            );

            return response()->json([
                'success' => true,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
