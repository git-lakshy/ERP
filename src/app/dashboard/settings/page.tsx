import { Settings, Building2, User } from "lucide-react";
import { updateOrganizationSettings, ensureUserAndOrg } from "@/lib/data-actions";

export default async function SettingsPage() {
    const user = await ensureUserAndOrg();

    if (!user) return <div>Unauthorized</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2 tracking-tighter uppercase">System Settings</h1>
                <p className="text-zinc-500 italic font-mono text-xs">Configure application preferences and system parameters.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Organization Settings */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-red-600" />
                        Organization Profile
                    </h2>

                    <form action={updateOrganizationSettings} className="space-y-4">
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="name" className="text-right text-sm text-zinc-400">
                                    Organization Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    defaultValue={user?.organization?.name}
                                    className="col-span-3 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-red-600 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="brandSymbol" className="text-right text-sm text-zinc-400">
                                    Brand Symbol
                                </label>
                                <input
                                    id="brandSymbol"
                                    name="brandSymbol"
                                    maxLength={3}
                                    placeholder="e.g. ERP"
                                    defaultValue={(user?.organization as any)?.brandSymbol || ''}
                                    className="col-span-3 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-red-600 outline-none uppercase"
                                />
                                <p className="col-start-2 col-span-3 text-[10px] text-zinc-500">Max 3 characters. Appears in the sidebar.</p>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="currency" className="text-right text-sm text-zinc-400">
                                    Currency Symbol
                                </label>
                                <select
                                    id="currency"
                                    name="currency"
                                    defaultValue={(user?.organization as any)?.currency || 'USD'}
                                    className="col-span-3 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-red-600 outline-none"
                                >
                                    <option value="USD">Dollar ($)</option>
                                    <option value="EUR">Euro (€)</option>
                                    <option value="GBP">Pound (£)</option>
                                    <option value="INR">Rupee (₹)</option>
                                    <option value="JPY">Yen (¥)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Organization ID (Read-Only)</label>
                            <div className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-500 font-mono">
                                {user.organization.id}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* User Profile (ReadOnly for now) */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <User className="h-5 w-5 text-red-600" />
                        User Account
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Email Address</label>
                            <div className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300">
                                {user.email}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Role</label>
                            <div className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300">
                                {user.role}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
