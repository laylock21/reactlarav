import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import {
    LayoutGrid,
    Package,
    Tags,
    Users,
    Truck,
    ChartColumn,
    Settings,
} from 'lucide-react';

import AppLogo from "@/components/app/app-logo";
import AppLogoIcon from "@/components/app/app-logo-icon";
import { NavFooter } from '@/components/sidebar/nav-footer';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
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
import { useSidebar } from "@/components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { dashboard } from "@/routes";
import stockMovement from "@/routes/stock-movement";
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
        children: [
            {
                title: "Stocks",
                href: "/stocks",
            },
            {
                title: "Stock Movement",
                href: "/stock-movement",
            },
            {
                title: "Archived",
                href: "/products/archived",
            },
        ],
    },
    {
        title: "Categories",
        href: "/categories",
        icon: Tags,
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
        children: [
            {
                title: "Analytics Export",
                href: "/analytics/export",
            },
        ],
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [];


export function AppSidebar() {
    const { state, toggleSidebar, isMobile } = useSidebar();

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <div className="flex items-center justify-between px-0">

                    {state === "expanded" ? (
                        <>
                            <SidebarMenu className="flex-1">
                                <SidebarMenuItem>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <SidebarMenuButton size="lg" asChild>
                                                <button
                                                    onClick={() => router.reload()}
                                                    className="flex items-center"
                                                >
                                                    <AppLogo />
                                                </button>
                                            </SidebarMenuButton>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center" hidden={state !== "expanded" || isMobile}>
                                            Refresh
                                        </TooltipContent>
                                    </Tooltip>
                                </SidebarMenuItem>
                            </SidebarMenu>

                            <SidebarTrigger />
                        </>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={toggleSidebar}
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-md
                                        mx-auto
                                        hover:bg-sidebar-accent
                                    "
                                >
                                    <AppLogoIcon className="size-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile}>
                                Open
                            </TooltipContent>
                        </Tooltip>
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
