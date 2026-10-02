<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        if ($request->hasFile('avatar')) {
            if ($user->avatar_path) {
                Storage::disk('public')->delete($user->avatar_path);
            }

            $validated['avatar_path'] = $request->file('avatar')->store('user_img', 'public');
        }

        unset($validated['avatar']);

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->forceFill(['email_verified_at' => null]);
        }

        $user->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Session rows restrict user deletes; the account is going away,
        // so its sessions go first. Same for its own audit trail: logs
        // reference the actor via RESTRICT, so purging them is part of
        // account deletion (the observer already skips logging the
        // deletion itself for the same reason).
        DB::table('sessions')->where('user_id', $user->getKey())->delete();
        DB::table('action_logs')->where('user_id', $user->getKey())->delete();

        // Orders or snapshots may still reference this user: rescue keeps
        // the failure a friendly message instead of a 500.
        $deleted = rescue(
            function () use ($user) {
                $user->delete();

                return true;
            },
            fn () => false
        );

        if (! $deleted) {
            return back()->withErrors([
                'user' => 'This account cannot be deleted while records are still assigned to it.',
            ]);
        }

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
