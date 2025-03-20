<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        
        if (Auth::attempt($request->only('email', 'password'))) {
            return Inertia::location('/');
            dd(1);
        }

        return response()->json([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }
}