import { useSyncExternalStore } from 'react';
import { persistAppearance } from '@/lib/persist-appearance';

export type FontSize = 'small' | 'medium' | 'large';

export type UseFontSizeReturn = {
    readonly fontSize: FontSize;
    readonly updateFontSize: (size: FontSize) => void;
    /** Adopt a size locally (DB hydration) without persisting. */
    readonly syncFontSize: (size: FontSize) => void;
};

// Shell/preview only: root font size in px. Tailwind v4 sizes everything
// in rem, so changing the root size scales the whole UI (including the
// heading scale). Medium (16px) is the browser default.
export const FONT_SIZE_PX: Record<FontSize, string> = {
    small: '14px',
    medium: '16px',
    large: '18px',
};

const listeners = new Set<() => void>();
let currentFontSize: FontSize = 'medium';

const getStoredFontSize = (): FontSize => {
    if (typeof window === 'undefined') {
        return 'medium';
    }

    return (localStorage.getItem('font-size') as FontSize) || 'medium';
};

const applyFontSize = (size: FontSize): void => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.style.fontSize = FONT_SIZE_PX[size];
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeFontSize(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (!localStorage.getItem('font-size')) {
        localStorage.setItem('font-size', 'medium');
    }

    currentFontSize = getStoredFontSize();
    applyFontSize(currentFontSize);
}

export function useFontSize(): UseFontSizeReturn {
    const fontSize: FontSize = useSyncExternalStore(
        subscribe,
        () => currentFontSize,
        () => 'medium',
    );

    const updateFontSize = (size: FontSize): void => {
        currentFontSize = size;

        // Local preview persistence; the server-side user setting
        // is synced right away so no save button is needed.
        localStorage.setItem('font-size', size);

        // Persist to user_settings so the preference follows the account.
        persistAppearance(localStorage.getItem('appearance') || 'system', size);

        applyFontSize(size);
        notify();
    };

    const syncFontSize = (size: FontSize): void => {
        currentFontSize = size;
        localStorage.setItem('font-size', size);
        applyFontSize(size);
        notify();
    };

    return { fontSize, updateFontSize, syncFontSize } as const;
}
