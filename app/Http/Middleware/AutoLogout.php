<?php 
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class AutoLogout
{
    public function handle($request, Closure $next)
    {
        // Check if the user is authenticated
        if (Auth::check()) {
            $lastActivity = session('lastActivityTime');
            $currentTime = now();
            $autoLogoutDuration = env('AUTO_LOGOUT_DURATION', 60); // Default to 60 minutes if not set

            // If the last activity time is set and exceeds 60 minutes, log out the user
            if ($lastActivity && $currentTime->diffInMinutes($lastActivity) > $autoLogoutDuration) {
                Auth::logout();
                session()->forget('lastActivityTime');
                return redirect()->route('login')->with('message', 'You have been logged out due to inactivity.');
            }

            // Update the last activity time
            session(['lastActivityTime' => $currentTime]);
        }

        return $next($request);
    }
}
