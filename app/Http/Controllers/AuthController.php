<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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
            
            // Log to verify user is authenticated
            \Illuminate\Support\Facades\Log::info('User authenticated:', [
                'user_id' => Auth::id(),
                'user_email' => Auth::user()->email,
                'session_id' => $request->session()->getId()
            ]);
            
            return response()->json([
                'success' => true,
                'user' => Auth::user()
            ]);
        }else{
            return response()->json(['success' => false, 'message' => 'Credentials do not match our records.']);
        }

    }

    public function signUp(Request $request)
    {
        $request->validate([
            'name' => ['required'],
            'surname' => ['required'],
            'email' => ['required', 'email', 'unique:users'],
            'birthday'  => ['required', 'date', 'before_or_equal:' . now()->subYears(18)->toDateString()],
            'phone_number' => ['required', 'digits:10'],
            'identity_number' => ['required', 'digits:11'],
            'password' => ['required', 'min:6', 'confirmed']
        ]);

        $user = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'email' => $request->email,
            'birthday' => $request->birthday,
            'phone_number' => $request->phone_number,
            'role' => 'customer',
            'identity_number' => $request->identity_number,
            'password' => Hash::make($request->password)
        ]);

        if($user){
            return response()->json([
                'message' => 'You have successfully registered!',
                'success' => true
            ]);
        }

        return response()->json([
            'errorMessage' => 'An error have occured!',
            'success' => false
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(['success' => true, 'auth' => Auth::user()] );
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = \App\Models\User::where('email', $request->email)->first();

        if ($user) {
            $status = Password::sendResetLink($request->only('email'), function ($user, $token) {
                $resetUrl = url('/reset-password/' . $token . '?email=' . urlencode($user->email));
                
                $user->notify(new \App\Notifications\CustomEmailNotification('password_reset', [
                    'user_name' => $user->name,
                    'reset_link' => $resetUrl,
                ]));
            });
        } else {
            $status = Password::INVALID_USER;
        }

        if ($status === Password::RESET_LINK_SENT || $status === Password::INVALID_USER) {
            return response()->json([
                'success' => true,
                'message' => 'If your email is registered, you will receive a password reset link.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => __($status),
        ], 422);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'min:6', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => __($status),
            ]);
        }
            
        return response()->json([
            'success' => false,
            'message' => __($status),
        ], 422);
    }

    // Admin Login Methods
    public function showAdminLogin()
    {
        if (Auth::check() && Auth::user()->role === 'admin') {
            return redirect('/adminpanel');
        }
        
        return Inertia::render('admin/Login');
    }

    public function adminLogin(Request $request)
    {
        \Log::info('Admin login attempt:', ['email' => $request->input('email')]);
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        Log::info('Validated credentials:', ['email' => $credentials['email']]);
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            Log::info('Authenticated user:', ['user_id' => $user->id, 'role' => $user->role]);
            if ($user->role !== 'admin') {
                Log::warning('Unauthorized admin access attempt:', ['user_id' => $user->id]);
                Auth::logout();
                return back()->withErrors([
                    'email' => 'Unauthorized access.',
                ]);
            }
            Log::info('Admin user logged in successfully:', ['user_id' => $user->id]);
            $request->session()->regenerate();
            Log::info('Session regenerated for admin user:', ['user_id' => $user->id, 'session_id' => $request->session()->getId()]);
            return redirect()->intended('/adminpanel');
        }
        Log::warning('Admin login failed for email:', ['email' => $request->input('email')]);
        return back()->withErrors([
            'email' => 'Invalid credentials.',
        ]);
    }

    public function showAdminChangePassword()
    {
        return Inertia::render('adminPanel/profile/ChangePassword', [
            'success' => session('success'),
        ]);
    }

    public function updateAdminPassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'min:6', 'confirmed'],
        ]);

        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            return back()->withErrors([
                'current_password' => 'Unauthorized action.',
            ]);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                'current_password' => 'Current password is incorrect.',
            ]);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return back()->with('success', 'Password updated successfully.');
    }

}
