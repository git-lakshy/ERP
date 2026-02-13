import { BarChart3, PieChart, TrendingUp, Package } from "lucide-react";
import { getReportsData, ensureUserAndOrg } from "@/lib/data-actions";

export default async function ReportsPage() {
    const [data, user] = await Promise.all([
        getReportsData(),
        ensureUserAndOrg()
    ]);

    if (!data) return <div>Loading...</div>

    // @ts-ignore
    const currency = user?.organization?.currency || "$";

    const { totalInventoryValue, transactions } = data

    // Calculate monthly revenue (simple approximation)
    const currentMonthRevenue = transactions
        .filter((t: any) => t.type === 'INCOME' && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((acc: number, t: any) => acc + Number(t.amount), 0)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2 tracking-tighter uppercase">Analytics & Reports</h1>
                <p className="text-zinc-500 italic font-mono text-xs">Deep dive into your business metrics and performance.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500 ring-1 ring-inset ring-blue-500/20">
                            <Package className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500 uppercase">Inventory Value</p>
                            <p className="text-2xl font-bold text-white">{currency} {totalInventoryValue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-green-500/10 text-green-500 ring-1 ring-inset ring-green-500/20">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500 uppercase">Monthly Revenue</p>
                            <p className="text-2xl font-bold text-white">{currency} {currentMonthRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 h-80 flex flex-col items-center justify-center space-y-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BarChart3 className="h-24 w-24 text-red-600" />
                </div>
                <div className="text-center z-10">
                    <h2 className="text-xl font-bold text-white mb-2">More Analytics Coming Soon</h2>
                    <p className="text-zinc-500">Advanced charting and data export features are in development.</p>
                </div>
            </div>
        </div>
    );
}
