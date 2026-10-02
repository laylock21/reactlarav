import { router } from '@inertiajs/react';
import { toast } from 'sonner';

/**
 * Persist appearance preferences to user_settings. Called automatically
 * whenever the theme or font size changes, so no save button is needed.
 * The endpoint is auth-guarded; calls from guest pages are rejected
 * harmlessly and local state still applies.
 */
export function persistAppearance(theme: string, fontSize: string): void {
    router.put(
        '/settings/appearance',
        { theme, font_size: fontSize },
        {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onError: () => toast.error('Unable to save appearance settings.'),
        },
    );
}
