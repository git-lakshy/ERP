import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";
import { ensureUserAndOrg } from "@/lib/data-actions";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch org details for branding
    const dbUser = await ensureUserAndOrg()
    const brandSymbol = (dbUser?.organization as any)?.brandSymbol || "S"
    const orgName = dbUser?.organization?.name || "ERP"

    const userName = user?.email?.split('@')[0] || "User"
    const userInitial = userName.charAt(0).toUpperCase()

    return (
        <div className="flex h-screen bg-zinc-950 overflow-hidden">
            {/* Sidebar - Desktop */}
            <Sidebar brandSymbol={brandSymbol} orgName={orgName} />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Navbar */}
                <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold text-white">Admin Console</h1>
                        <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-600/20">
                            Pro Plan
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{userName}</p>
                                <p className="text-xs text-zinc-500 italic">{user?.email}</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600 font-bold uppercase">
                                {userInitial}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
