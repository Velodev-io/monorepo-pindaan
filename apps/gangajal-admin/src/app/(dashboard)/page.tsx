"use client";

import { Package, ShoppingBag, Send, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { OrderService } from "@/services/order.service";

import { Order } from "@pinddaan/types";

export default function DashboardOverview() {
    const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const res = await OrderService.getRecentOrders();
                if (res.success) {
                    setRecentOrders(res.data);
                }
            } catch (err) {
                console.error("Dashboard fetch failed", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    const statCards = [
        { title: "Total Products", value: stats.products, icon: Package, route: "/products" },
        { title: "Total Orders", value: stats.orders, icon: ShoppingBag, route: "/orders" },
        { title: "Est. Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, route: "/" },
        { title: "Pending Shipments", value: stats.pending, icon: Send, route: "/shipping" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Overview</h1>
                <p className="text-zinc-500 mt-2">Monitor Gangajal.store inventory, orders, and dispatch metrics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, i) => (
                    <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md hover:border-[#FF9933]/30">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{card.title}</h3>
                            <card.icon className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 col-span-4 min-h-[400px]">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-6">Revenue Overview</h3>
                    <div className="flex items-center justify-center h-64 text-zinc-400 text-sm border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl">
                        Chart rendering pending integration...
                    </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 col-span-3 min-h-[400px]">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-6">Recent Orders</h3>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center text-zinc-400 italic">Syncing with portal...</div>
                        ) : recentOrders.length === 0 ? (
                            <div className="text-center py-10 text-zinc-400 text-sm italic">No recent orders found.</div>
                        ) : (
                            recentOrders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0">
                                    <div>
                                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{order.customerName}</div>
                                        <div className="text-sm text-zinc-500">{order.id.slice(0, 8)} - ${order.total}</div>
                                    </div>
                                    <div className={`text-sm font-bold px-3 py-1 rounded-full text-[#FF9933] bg-[#FF9933]/10`}>
                                        {order.status}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
