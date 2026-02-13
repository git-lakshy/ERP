import { TrendingUp, TrendingDown, Banknote, PlusCircle } from "lucide-react";
import { getTransactions, createTransaction, ensureUserAndOrg } from "@/lib/data-actions";

export default async function FinancePage() {
    const [transactions, user] = await Promise.all([
        getTransactions(),
        ensureUserAndOrg()
    ]);

    const currency = user?.organization?.currency || "$";

    // Calculate optimistically for now (in real app, use aggregation query)
    const income = transactions.filter((t: any) => t.type === 'INCOME').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
    const expenses = transactions.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
    const netProfit = income - expenses;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2 tracking-tighter uppercase">Financial Overview</h1>
                <p className="text-zinc-500 italic font-mono text-xs">Track revenue, expenses, and financial health.</p>
            </div>

            {/* Financial Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-green-500/10 text-green-500 ring-1 ring-inset ring-green-500/20">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500 uppercase">Total Revenue</p>
                            <p className="text-2xl font-bold text-white">{currency} {income.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-red-500/10 text-red-500 ring-1 ring-inset ring-red-500/20">
                            <TrendingDown className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500 uppercase">Total Expenses</p>
                            <p className="text-2xl font-bold text-white">{currency} {expenses.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ring-1 ring-inset ${netProfit >= 0 ? 'bg-blue-500/10 text-blue-500 ring-blue-500/20' : 'bg-orange-500/10 text-orange-500 ring-orange-500/20'}`}>
                            <Banknote className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-zinc-500 uppercase">Net Profit</p>
                            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-white' : 'text-orange-500'}`}>{currency} {netProfit.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Transaction List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-left text-sm text-zinc-400">
                                <thead className="text-xs uppercase text-zinc-500 bg-zinc-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Description</th>
                                        <th scope="col" className="px-6 py-3">Category</th>
                                        <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center italic">No transactions recorded.</td>
                                        </tr>
                                    ) : (
                                        transactions.map((tx: any) => (
                                            <tr key={tx.id} className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs">
                                                    {new Date(tx.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-white">{tx.description || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-zinc-700/10">
                                                        {tx.category}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 text-right font-mono font-bold ${tx.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {tx.type === 'INCOME' ? '+' : '-'}{currency} {Number(tx.amount).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Add Transaction Form */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 sticky top-8">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <PlusCircle className="h-5 w-5 text-red-600" />
                            New Transaction
                        </h2>
                        <form action={createTransaction} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="type" className="text-xs font-medium text-zinc-400 uppercase">Type</label>
                                <select required name="type" id="type" className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50">
                                    <option value="INCOME">Income</option>
                                    <option value="EXPENSE">Expense</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="amount" className="text-xs font-medium text-zinc-400 uppercase">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-zinc-500">{currency}</span>
                                    <input required type="number" step="0.01" name="amount" id="amount" className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="category" className="text-xs font-medium text-zinc-400 uppercase">Category</label>
                                <input required name="category" id="category" placeholder="e.g. Sales, Rent" className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-xs font-medium text-zinc-400 uppercase">Description</label>
                                <textarea name="description" id="description" rows={3} className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50" />
                            </div>

                            <button type="submit" className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all">
                                Record Transaction
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
