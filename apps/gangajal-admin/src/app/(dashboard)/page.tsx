"use client";

import { Package, ShoppingBag, Send, TrendingUp } from "lucide-react";

export default function DashboardOverview() {
    const stats = { products: 12, orders: 48, revenue: 12500, pending: 5 };
    const recentOrders = [
        { id: "ORD-1", customer: "Rahul Sharma", total: "$25.00", status: "PENDING" },
        { id: "ORD-2", customer: "Anjali K.", total: "$19.99", status: "PAID" },
        { id: "ORD-3", customer: "Vikram S.", total: "$149.99", status: "PACKED" },
    ];

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
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0">
                                <div>
                                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{order.customer}</div>
                                    <div className="text-sm text-zinc-500">{order.id} - {order.total}</div>
                                </div>
                                <div className={`text-sm font-bold px-3 py-1 rounded-full ${order.status === "PENDING" ? "text-amber-600 bg-amber-50 dark:bg-amber-950/30" : "text-[#FF9933] bg-[#FF9933]/10"}`}>
                                    {order.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
