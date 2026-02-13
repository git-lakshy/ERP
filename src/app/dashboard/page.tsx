import {
    Package,
    TrendingUp,
    Users,
    AlertTriangle,
    DollarSign,
    Euro,
    PoundSterling,
    IndianRupee,
    JapaneseYen,
    Banknote
} from "lucide-react";
import { getDashboardStats, ensureUserAndOrg } from "@/lib/data-actions";

export default async function DashboardPage() {
    const [statsData, user] = await Promise.all([
        getDashboardStats(),
        ensureUserAndOrg()
    ]);

    if (!statsData || !user) return <div>Failed to initialize session. Please check your Supabase connection.</div>

    // @ts-ignore
    const currency = user.organization?.currency || "$";

    // Select icon based on currency
    let CurrencyIcon: any = DollarSign;
    if (currency === '€') CurrencyIcon = Euro;
    if (currency === '£') CurrencyIcon = PoundSterling;
    if (currency === '₹') CurrencyIcon = IndianRupee;
    if (currency === '¥') CurrencyIcon = JapaneseYen;
    // Fallback or generic
    if (currency === '$') CurrencyIcon = DollarSign;

    const stats = [
        { name: 'Total Products', value: statsData.totalProducts.toString(), icon: Package, change: '+0%', changeType: 'increase' },
        { name: 'Revenue (MTD)', value: `${currency} ${statsData.revenue.toLocaleString()}`, icon: TrendingUp, change: '+0%', changeType: 'increase' },
        { name: 'Active Users', value: statsData.activeUsers.toString(), icon: Users, change: '+0%', changeType: 'increase' },
        { name: 'Low Stock Items', value: statsData.lowStockCount.toString(), icon: AlertTriangle, change: 'Critical', changeType: 'decrease' },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2 tracking-tighter uppercase">Enterprise Command Center</h1>
                <p className="text-zinc-500 italic font-mono text-xs">Awaiting upstream telemetry... status: <span className="text-red-600 animate-pulse">LIVE</span></p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-red-600/50 shadow-2xl group"
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.name}</p>
                                <p className="mt-2 text-4xl font-bold text-white tracking-tighter group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
                            </div>
                            <div className="rounded-lg bg-red-600/5 p-3 text-red-600 border border-red-600/10 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-[10px] font-bold uppercase tracking-widest relative z-10">
                            <span className={stat.changeType === 'increase' ? 'text-zinc-500' : 'text-red-600'}>
                                {stat.change}
                            </span>
                            <span className="ml-2 text-zinc-700">Telemetry Stream</span>
                        </div>

                        {/* Subtle Background Glow */}
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-600/5 blur-3xl group-hover:bg-red-600/10 transition-colors" />
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Visualizations */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 h-80 flex flex-col items-center justify-center space-y-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Package className="h-24 w-24 text-red-600" />
                    </div>
                    <div className="h-40 w-full flex items-end justify-around gap-2 px-8 relative z-10">
                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                            <div
                                key={i}
                                className="w-full bg-zinc-800 rounded-t-sm transition-all duration-1000 group-hover:bg-red-600 hover:scale-110"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                    <div className="space-y-1 text-center relative z-10">
                        <p className="text-xs font-bold text-zinc-500 font-mono tracking-widest uppercase">Inventory Level Architecture</p>
                        <p className="text-[10px] text-zinc-600 font-mono">DISTRIBUTION ANALYSIS: OPTIMAL</p>
                    </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 h-80 flex flex-col items-center justify-center space-y-6 shadow-xl relative group">
                    <div className="relative h-48 w-48 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent border-r-transparent animate-spin-slow" />
                        <div className="absolute inset-2 rounded-full border border-zinc-800 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white tracking-tighter">100%</span>
                        </div>
                    </div>
                    <div className="space-y-1 text-center">
                        <p className="text-xs font-bold text-zinc-500 font-mono tracking-widest uppercase">System Integrity Baseline</p>
                        <p className="text-[10px] text-red-600/60 font-mono animate-pulse uppercase">Syncing Cloud...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

