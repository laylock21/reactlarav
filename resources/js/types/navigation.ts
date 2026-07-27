import type { InertiaHref } from '@/types/inertia';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaHref>;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaHref>;
    icon?: LucideIcon | null;
    isActive?: boolean;
};
