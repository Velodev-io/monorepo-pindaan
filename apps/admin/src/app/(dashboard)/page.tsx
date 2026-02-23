"use client";

import { useEffect, useState } from "react";
import { Users, Bookmark, FileStack, TrendingUp } from "lucide-react";

import { apiClient } from "@/lib/api-client";

export default function DashboardOverview() {
    const [stats, setStats] = useState({ users: 0, bookings: 0, revenue: 0, pending: 0 });
    const [recentBookings, setRecentBookings] = useState<unknown[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient("/users/stats/dashboard");
                if (res.success) {
                    setStats(res.stats);
                    setRecentBookings(res.recentBookings || []);
                }
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: "Total Users", value: stats.users, icon: Users, route: "/users" },
        { title: "Total Bookings", value: stats.bookings, icon: Bookmark, route: "/bookings" },
        { title: "Est. Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, route: "/" },
        { title: "Pending Approvals", value: stats.pending, icon: FileStack, route: "/services" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Overview</h1>
                <p className="text-zinc-500 mt-2">Monitor Pinddaan network activity and key metrics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, i) => (
                    <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md hover:border-amber-500/30">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{card.title}</h3>
                            <card.icon className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <div className="mt-4">
                            {loading ? (
                                <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-md" />
                            ) : (
                                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{card.value}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 col-span-4 min-h-[400px]">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-6">Revenue Overview</h3>
                    <div className="flex items-center justify-center h-64 text-zinc-400 text-sm">
                        Chart rendering pending integration...
                    </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 col-span-3 min-h-[400px]">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-6">Recent Bookings</h3>
                    <div className="space-y-4">
                        {loading ? (
                           <div className="animate-pulse space-y-4">
                              <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
                              <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg"></div>
                           </div>
                        ) : recentBookings.length === 0 ? (
                            <div className="text-sm text-zinc-500">No bookings found.</div>
                        ) : recentBookings.map((booking: any) => (
                            <div key={booking.id} className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0">
                                <div>
                                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{booking.user?.name || booking.departedName || "Unknown"}</div>
                                    <div className="text-sm text-zinc-500 truncate w-32 md:w-48">{booking.service?.name || "Pinddaan Ritual"}</div>
                                </div>
                                <div className={`text-sm font-medium px-2 py-1 rounded-md ${booking.status === "PENDING" ? "text-amber-600 bg-amber-50 dark:bg-amber-950/30" : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"}`}>
                                    {booking.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
