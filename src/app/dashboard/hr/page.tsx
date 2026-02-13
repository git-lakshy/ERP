import { Users, Plus, UserPlus } from "lucide-react";
import { getEmployees, createEmployee, ensureUserAndOrg } from "@/lib/data-actions";

export default async function EmployeePage() {
    const [employees, user] = await Promise.all([
        getEmployees(),
        ensureUserAndOrg()
    ]);

    const currency = user?.organization?.currency || "$";

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2 tracking-tighter uppercase">Employee Management</h1>
                    <p className="text-zinc-500 italic font-mono text-xs">Manage your team and their roles.</p>
                </div>

                {/* Add Employee Button/Modal Trigger */}
                {/* For simplicity we'll use a details/summary for the form or a simple form below */}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Employee List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-red-600" />
                            Team Roster
                        </h2>

                        <div className="relative overflow-x-auto">
                            <table className="w-full text-left text-sm text-zinc-400">
                                <thead className="text-xs uppercase text-zinc-500 bg-zinc-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Name</th>
                                        <th scope="col" className="px-6 py-3">Role</th>
                                        <th scope="col" className="px-6 py-3">Department</th>
                                        <th scope="col" className="px-6 py-3">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center italic">No employees found.</td>
                                        </tr>
                                    ) : (
                                        employees.map((emp: any) => (
                                            <tr key={emp.id} className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">
                                                    {emp.firstName} {emp.lastName}
                                                    <div className="text-xs text-zinc-600 font-mono">{emp.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-zinc-700/10">
                                                        {emp.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{emp.department}</td>
                                                <td className="px-6 py-4 font-mono text-xs">
                                                    {new Date(emp.joinedAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Add Employee Form (Hidden for Employees) */}
                <div className="lg:col-span-1">
                    {user?.role !== 'EMPLOYEE' ? (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 sticky top-8">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-red-600" />
                                Onboard Employees
                            </h2>
                            <form action={createEmployee} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="text-xs font-medium text-zinc-400 uppercase">First Name</label>
                                        <input required name="firstName" id="firstName" className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="text-xs font-medium text-zinc-400 uppercase">Last Name</label>
                                        <input required name="lastName" id="lastName" className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase">Email Address</label>
                                    <input required type="email" name="email" id="email" className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="role" className="text-xs font-medium text-zinc-400 uppercase">Role</label>
                                        <input required name="role" id="role" placeholder="e.g. Developer" className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="department" className="text-xs font-medium text-zinc-400 uppercase">Department</label>
                                        <input required name="department" id="department" placeholder="e.g. Engineering" className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="salary" className="text-xs font-medium text-zinc-400 uppercase">Annual Compensation</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-zinc-500">{currency}</span>
                                        <input required type="number" step="0.01" name="salary" id="salary" className="w-full rounded-md border border-zinc-800 bg-zinc-950 pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50" />
                                    </div>
                                </div>

                                <button type="submit" className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all">
                                    Add Employee
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sticky top-8 text-center space-y-3">
                            <div className="h-12 w-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-500">
                                <UserPlus className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-white">Restricted Access</h3>
                                <p className="text-xs text-zinc-500 mt-1">Only Administrators and Managers can onboard new talent.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
