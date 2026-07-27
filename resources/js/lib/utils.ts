import type { InertiaHref } from '@/types/inertia';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaHref>): string {
    return typeof url === 'string' ? url : (url as any).url;
}
