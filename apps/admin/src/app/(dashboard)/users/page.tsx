"use client";

import { useEffect, useState } from "react";
import { User } from "@pinddaan/types";
import { UserService } from "@/services/user.service";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        UserService.getUsers()
            .then((res) => setUsers(res.data || []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleToggleActive = async (id: string) => {
        try {
            await UserService.disableUser(id);
            setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
        } catch (err) {
            alert("Failed to update status: " + (err as Error).message);
        }
    };

    const handleRoleChange = async (id: string, newRole: string) => {
        try {
            await UserService.updateUserRole(id, newRole);
            setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole as any } : u));
        } catch (err) {
            alert("Failed to update role: " + (err as Error).message);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Users</h1>
            <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/50">
                    <input 
                        type="search" 
                        placeholder="Search users..." 
                        className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 max-w-sm w-full outline-amber-500"
                    />
                </div>
                {loading ? (
                    <div className="p-12 text-center text-zinc-500 animate-pulse">Loading users...</div>
                ) : error ? (
                    <div className="p-12 text-center text-red-500">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.name || "Unknown"}</div>
                                            <div className="text-[10px] text-zinc-400 font-normal italic mt-0.5">{user.address || "No address provided"}</div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <select 
                                                value={user.role} 
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className={`px-2 py-1 rounded-md text-xs font-semibold bg-transparent border border-zinc-200 dark:border-zinc-700 outline-amber-500 cursor-pointer ${user.role === "ADMIN" ? "text-amber-600" : "text-zinc-600"}`}
                                            >
                                                <option value="USER">USER</option>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleToggleActive(user.id)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${user.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                                            >
                                                {user.isActive ? "Disable Access" : "Grant Access"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && <div className="p-8 text-center text-zinc-500">No users found.</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
