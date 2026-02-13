"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    Users,
    BarChart3,
    Settings,
    CreditCard,
    LogOut
} from "lucide-react";
import { signOut } from "@/lib/auth-actions";

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
    { name: 'Employees', href: '/dashboard/hr', icon: Users },
    { name: 'Finance', href: '/dashboard/finance', icon: CreditCard },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar({ brandSymbol, orgName }: { brandSymbol?: string, orgName?: string }) {
    const pathname = usePathname();

    const displayBrand = brandSymbol || "S";
    const displayName = orgName || "ERP";

    return (
        <div className="flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950">
            <div className="flex h-16 items-center gap-2 px-6 border-b border-zinc-800">
                <div className="flex h-8 w-8 items-center justify-center">
                    <img
                        src="/logo.svg"
                        alt="Logo"
                        className="h-full w-full object-contain"
                    />
                </div>
                <span className="font-bold text-lg tracking-tight truncate">
                    <span className="text-white">{displayName.split(' ')[0]}</span>
                    {displayName.split(' ').length > 1 && (
                        <span className="text-red-600"> {displayName.split(' ').slice(1).join(' ')}</span>
                    )}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {navigation.map((item) => {
                    // Logic for active state:
                    // 1. Dashboard: Only active if exact match '/dashboard'
                    // 2. Others: Active if pathname starts with their href
                    const isDashboard = item.href === '/dashboard';
                    const isActive = isDashboard
                        ? pathname === '/dashboard'
                        : pathname.startsWith(item.href);

                    // Logic for "highlight effect of hover when other pages visited" for Dashboard
                    // If we are on a sub-page (e.g. /dashboard/inventory), Dashboard should look like it's hovered (inactive style but maybe slight distinction if needed, but user said "highlight to the highlight effect of hover").
                    // actually, the user said "change its highlight to the highlight effect of hover when other pages is visited".
                    // This implies when NOT active, it should just use the default inactive style (which has hover effect).
                    // proportional indentation: if not dashboard, indent slightly.

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                !isDashboard && "ml-4", // Indent sub-items
                                isActive
                                    ? "bg-red-600/10 text-red-600 border border-red-600/20"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-red-600" : "text-zinc-500")} />
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-zinc-800">
                <form action={signOut}>
                    <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 rounded-md hover:text-white hover:bg-zinc-900 transition-colors">
                        <LogOut className="h-5 w-5 text-zinc-500" />
                        Logout
                    </button>
                </form>
            </div>
        </div>
    );
}
