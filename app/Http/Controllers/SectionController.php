<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SectionController extends Controller
{
    public function showPage()
    {
        return Inertia::render('adminPanel/site/Site');
    }
}
