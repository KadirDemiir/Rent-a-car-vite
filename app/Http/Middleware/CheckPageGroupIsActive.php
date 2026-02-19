<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class CheckPageGroupIsActive
{
    public function handle(Request $request, Closure $next, ?string $groupName = null): Response
    {
        if (!$groupName) {
            return Inertia::render('NotFound')->toResponse($request)->setStatusCode(404);
        }

        $pages = getPagesCache();

        if (!$pages instanceof \Illuminate\Support\Collection) {
            return Inertia::render('NotFound')->toResponse($request)->setStatusCode(404);
        }

        $page = $pages->where('route_group_name', $groupName)->first();

        if (!$page || empty($page->is_active)) {
            return Inertia::render('NotFound')->toResponse($request)->setStatusCode(404);
        }

        Inertia::share('pageMeta', $page->only([
            'title',
            'meta_title',
            'meta_description',
            'meta_keywords'
        ]));

        return $next($request);
    }
}
