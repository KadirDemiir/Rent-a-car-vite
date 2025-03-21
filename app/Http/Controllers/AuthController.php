<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function deneme(Request $request)
    {
        dd($request->all());
    }

    public function auth(Request $request)
    {
        if($request->has('log_in'))
            return $this->logIn($request);
        else if($request->has('sign_up'))
            return $this->signUp($request);
        else return Inertia::render('auth/Auth', [
            'errorMessage' => '*An error has occoured'
        ]);
    }

    public function logIn(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
 
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
 
            return redirect('/');
        }
 
        return Inertia::render('auth/Auth', [
            'errorMessage' => 'Credentials do not match our records.',

        ]);

    }

    public function signUp(Request $request)
    {
        $request->validate([
            'name' => ['required'],
            'surname' => ['required'],
            'email' => ['required', 'email', 'unique:users'],
            'birthday'  => ['required', 'date', 'before_or_equal:' . now()->subYears(18)->toDateString()],
            'phone_number' => ['required', 'digits:10'],
            'tc_number' => ['required', 'digits:11'],
            'password' => ['required', 'min:6', 'confirmed'] 
        ]);

        $user = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'email' => $request->email,
            'birthday' => $request->birthday,
            'phone_number' => $request->phone_number,
            'tc_number' => $request->tc_number,
            'password' => Hash::make($request->password)
        ]);

        if($user){
            return Inertia::render('auth/Auth', [
                'message' => 'You have successfully registered!'
            ]);
        }

        return Inertia::render('auth/Auth', [
            'errorMessage' => 'An error have occured!',
            'page' => 'Signup'
        ]);
    }

    public function logout(Request $request)
    {
            Auth::logout();
 
        $request->session()->invalidate();
 
        $request->session()->regenerateToken();
 
        return redirect('/');
    }
}
