import AppLogoIcon from "@/components/app-logo-icon";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function AppLogo() {
    const { state } = useSidebar();

    return (
        <div className="flex items-center overflow-hidden">
            {/* Logo Icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>

            {/* Animated Logo Text */}
            <div
                className={cn(
                    "ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
                    state === "collapsed"
                        ? "max-w-0 opacity-0"
                        : "max-w-[160px] opacity-100"
                )}
            >
                <span className="block text-sm font-semibold leading-tight">
                    Venti
                </span>
            </div>
        </div>
    );
}