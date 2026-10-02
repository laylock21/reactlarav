<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ValidateSession
{
    /**
     * Single-session enforcement: a login from another device/browser
     * invalidates this one. First run adopts the current session so
     * pre-existing users are not locked out on deploy.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null || ! $request->hasSession()) {
            return $next($request);
        }

        $currentSessionId = $request->session()->getId();
        $storedSessionId = $user->current_session_id;

        if ($storedSessionId === null) {
            $user->forceFill(['current_session_id' => $currentSessionId])->save();

            return $next($request);
        }

        if ($storedSessionId !== $currentSessionId) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->with('error', 'Your session has been invalidated. Please log in again.');
        }

        return $next($request);
    }
}
