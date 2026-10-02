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
        // firstOrNew with defaults keeps every value non-nullable for
        // callers while never persisting a row: a missing settings row
        // simply reads as defaults.
        $settings = $request->user()->settings()->firstOrNew([
            'theme' => 'system',
            'font_size' => 'medium',
            'items_per_page' => 20,
        ]);

        return Inertia::render('settings/appearance', [
            'settings' => [
                'theme' => $settings->theme,
                'font_size' => $settings->font_size,
                'items_per_page' => $settings->items_per_page,
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
            'theme' => ['sometimes', 'required', Rule::in(['light', 'dark', 'system'])],
            'font_size' => ['sometimes', 'required', Rule::in(['small', 'medium', 'large'])],
            'items_per_page' => ['sometimes', 'required', 'integer', 'min:5', 'max:100'],
        ]);

        $request->user()->settings()->updateOrCreate([], $validated);

        return back();
    }
}
