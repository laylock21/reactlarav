import { useSidebar } from "@/components/ui/sidebar";
import { dashboard, products } from "@/routes";
import { Link } from "@inertiajs/react";
import {
    BookOpen,
    FolderGit2,
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

import AppLogo from '@/components/app-logo';
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
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <div className="flex items-center justify-between px-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                {state === "collapsed" ? (
                                    <button
                                        onClick={toggleSidebar}
                                        className="flex w-full items-center justify-center"
                                    >
                                        <AppLogo />
                                    </button>
                                ) : (
                                    <Link href={dashboard()} prefetch>
                                        <AppLogo />
                                    </Link>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    <SidebarTrigger />
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
