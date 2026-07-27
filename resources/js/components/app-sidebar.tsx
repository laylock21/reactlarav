import AppLogo from "@/components/app-logo";
import AppLogoIcon from "@/components/app-logo-icon";
import { useSidebar } from "@/components/ui/sidebar";
import { dashboard } from "@/routes";
import products from "@/routes/products";
import { Link } from "@inertiajs/react";
import {
    LayoutGrid,
    Package,
    Tags,
    ArrowDownToLine,
    ArrowUpFromLine,
    Users,
    Truck,
    ChartColumn,
    Settings,
} from 'lucide-react';

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: "Products",
        href: "/products",
        icon: Package,
    },
    {
        title: "Categories",
        href: "/categories",
        icon: Tags,
    },
    {
        title: "Stock In",
        href: "/stock-in",
        icon: ArrowDownToLine,
    },
    {
        title: "Stock Out",
        href: "/stock-out",
        icon: ArrowUpFromLine,
    },
    {
        title: "Users",
        href: "/users",
        icon: Users,
    },
    {
        title: "Suppliers",
        href: "/suppliers",
        icon: Truck,
    },
    {
        title: "Analytics",
        href: "/analytics",
        icon: ChartColumn,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [];


export function AppSidebar() {
    const { state, toggleSidebar } = useSidebar();
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <div className="flex items-center justify-between px-2">

                    {state === "expanded" ? (
                        <>
                            <SidebarMenu className="flex-1">
                                <SidebarMenuItem>
                                    <SidebarMenuButton size="lg" asChild>
                                        <Link href={dashboard()} prefetch>
                                            <AppLogo />
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>

                            <SidebarTrigger />
                        </>
                    ) : (
                        <button
                            onClick={toggleSidebar}
                            className="flex h-10 w-full items-center justify-center rounded-md hover:bg-sidebar-accent"
                        >
                            <AppLogoIcon className="h-6 w-6" />
                        </button>
                    )}

                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
