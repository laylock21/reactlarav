import { Link, router } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useCurrentUrl } from "@/hooks/use-current-url";
import type { NavItem } from "@/types";

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
        const state: Record<string, boolean> = {};

        items.forEach(item => {
            if (
                item.children?.some(child =>
                    isCurrentUrl(child.href)
                )
            ) {
                state[item.title] = true;
            }
        });

        return state; 
    });

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>

            <SidebarMenu>
                {items.map(item => {
                    const hasChildren = !!item.children?.length;
                    const isOpen = !!openMenus[item.title];

                    if (!hasChildren) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        <div className="flex items-center gap-2">
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </div>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                onClick={() => {
                                    router.visit(item.href);
                                }}
                                tooltip={{ children: item.title }}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    {item.icon && <item.icon />}

                                    <span className="flex-1 truncate">
                                        {item.title}
                                    </span>
                                </div>

                                <ChevronRight
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();

                                        setOpenMenus((prev) => ({
                                            ...prev,
                                            [item.title]: !prev[item.title],
                                        }));
                                    }}
                                    className={`
                                        h-4
                                        w-4
                                        shrink-0
                                        cursor-pointer
                                        transition-transform
                                        duration-500
                                        ease-[cubic-bezier(0.22,1,0.36,1)]
                                        ${isOpen ? "rotate-90" : ""}
                                    `}
                                />
                            </SidebarMenuButton>

                            <div
                                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                    isOpen
                                        ? "max-h-40 opacity-100"
                                        : "max-h-0 opacity-0"
                                }`}
                            >
                                <SidebarMenu
                                    className={`ml-6 mt-1 border-l pl-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                        isOpen ? "translate-x-0" : "-translate-x-2"
                                    }`}
                                >
                                    {item.children?.map(child => (
                                        <SidebarMenuItem key={child.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isCurrentUrl(child.href)}
                                            >
                                                <Link href={child.href} prefetch>
                                                    <span>{child.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </div>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
