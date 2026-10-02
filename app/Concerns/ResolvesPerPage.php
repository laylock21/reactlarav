<?php

namespace App\Concerns;

trait ResolvesPerPage
{
    /**
     * Resolve the pagination size from the authenticated user's settings,
     * falling back to the given default. Clamped to a sane range so junk
     * data can never produce absurd pages.
     */
    protected function perPage(int $fallback = 10): int
    {
        $configured = auth()->user()?->settings?->items_per_page;

        if (! is_numeric($configured)) {
            return $fallback;
        }

        return max(5, min(100, (int) $configured));
    }
}
