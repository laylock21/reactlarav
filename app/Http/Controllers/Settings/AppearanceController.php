<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AppearanceController extends Controller
{
    /**
     * Show the appearance settings page with the user's saved values so
     * the UI can treat the database as the source of truth.
     */
    public function edit(Request $request): Response
    {
        $settings = $request->user()->settings;

        return Inertia::render('settings/appearance', [
            'settings' => [
                'theme' => $settings?->theme ?? 'system',
                'font_size' => $settings?->font_size ?? 'medium',
            ],
        ]);
    }

    /**
     * Persist the user's appearance preferences. Called automatically
     * whenever the theme or font size changes; no save button needed.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'theme' => ['required', Rule::in(['light', 'dark', 'system'])],
            'font_size' => ['required', Rule::in(['small', 'medium', 'large'])],
        ]);

        $request->user()->settings()->updateOrCreate([], $validated);

        return back();
    }
}
