import { Plus, Search, Filter, Package } from "lucide-react";
import { getProducts, createProduct, ensureUserAndOrg } from "@/lib/data-actions";
import { cn } from "@/lib/utils";
import { InventoryHeaderActions } from "@/components/inventory/header-actions";
import { InventoryRowActions } from "@/components/inventory/row-actions";

export default async function InventoryPage() {
    const [products, user] = await Promise.all([
        getProducts(),
        ensureUserAndOrg()
    ]);

    // @ts-ignore
    const currency = user?.organization?.currency || "$";

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Inventory Management</h1>
                    <p className="text-zinc-500 italic">Track and manage your enterprise stock levels.</p>
                </div>
                <InventoryHeaderActions />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm shadow-lg">
                    <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Total Inventory Items</p>
                    <p className="mt-2 text-3xl font-bold text-white tracking-tight">{products.length}</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm shadow-lg">
                    <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Low Stock Alerts</p>
                    <p className="mt-2 text-3xl font-bold text-red-500 tracking-tight">{products.filter((p: any) => p.quantity < 10 && p.quantity > 0).length}</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm shadow-lg">
                    <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Out of Stock</p>
                    <p className="mt-2 text-3xl font-bold text-zinc-300 tracking-tight">{products.filter((p: any) => p.quantity === 0).length}</p>
                </div>
            </div>

            {/* Simple Add Product Form */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl border-t-2 border-t-red-600/50">
                <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-red-600" />
                    Rapid Item Initialization
                </h3>
                <form action={createProduct} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Product Name</label>
                        <input name="name" required placeholder="Component Alpha-9" className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-red-600 focus:ring-1 focus:ring-red-600/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Serial SKU</label>
                        <input name="sku" required placeholder="SKU-00X-Z" className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-red-600 focus:ring-1 focus:ring-red-600/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Price</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-zinc-500 text-xs">{currency}</span>
                            <input name="price" type="number" step="0.01" required placeholder="0.00" className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-8 pr-4 py-2.5 text-sm text-white focus:border-red-600 focus:ring-1 focus:ring-red-600/20 outline-none transition-all" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Qty</label>
                        <input name="quantity" type="number" defaultValue="0" min="0" className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-red-600 focus:ring-1 focus:ring-red-600/20 outline-none transition-all" />
                    </div>
                    <button type="submit" className="h-[42px] rounded-md bg-red-600 px-6 text-sm font-bold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/10 active:scale-[0.98]">
                        Confirm
                    </button>
                </form>
            </div>

            {/* Inventory Table */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-4 gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search active inventory..."
                            className="w-full rounded-md border border-zinc-800 bg-zinc-950 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900">
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-950/50 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                <th className="px-6 py-4">Item Catalog</th>
                                <th className="px-6 py-4">SKU Code</th>
                                <th className="px-6 py-4">Unit Price</th>
                                <th className="px-6 py-4">Current Status</th>
                                <th className="px-6 py-4">Stock Level</th>
                                <th className="px-6 py-4 text-right">Utility</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Package className="h-10 w-10 text-zinc-800" />
                                            <p className="text-zinc-500 italic max-w-xs">No active inventory detected. Initialize your first industrial component using the secure form above.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.map((product: any) => (
                                <tr key={product.id} className="group hover:bg-red-600/5 transition-all duration-300">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">{product.name}</span>
                                            <span className="text-[10px] text-zinc-600 uppercase font-mono mt-0.5">Hardware / Category A</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <code className="rounded bg-zinc-950 px-2 py-1 text-[11px] font-mono text-zinc-500 border border-zinc-800">{product.sku}</code>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-zinc-300 font-mono text-sm">{currency} {Number(product.price || 0).toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tighter border",
                                            product.quantity > 10 ? "bg-green-600/10 text-green-500 border-green-600/20" :
                                                product.quantity > 0 ? "bg-red-600/10 text-red-500 border-red-600/20" :
                                                    "bg-zinc-800 text-zinc-500 border-zinc-700"
                                        )}>
                                            {product.quantity > 10 ? 'Available' : product.quantity > 0 ? 'Critical' : 'Depleted'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-1 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-700 ease-in-out",
                                                        product.quantity < 10 ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.7)]' : 'bg-red-500'
                                                    )}
                                                    style={{ width: `${Math.min((product.quantity / 50) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className={cn(
                                                "text-sm font-mono font-bold w-10",
                                                product.quantity < 10 ? "text-red-600" : "text-zinc-400"
                                            )}>
                                                {product.quantity.toString().padStart(3, '0')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <InventoryRowActions productId={product.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
