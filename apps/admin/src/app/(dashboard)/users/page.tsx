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
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{user.name || "Unknown"}</td>
                                        <td className="px-6 py-4 text-zinc-500">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${user.role === "ADMIN" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-amber-600 dark:text-amber-500 hover:underline font-medium">Manage</button>
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
