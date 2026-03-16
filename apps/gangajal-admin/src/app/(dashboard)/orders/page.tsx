"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { OrderService } from "@/services/order.service";
import { Order } from "@pinddaan/types";

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await OrderService.getAll(1, 50, statusFilter);
            if (res.data) setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getStatusStyle = (status: string) => {
        switch(status) {
            case "PENDING": return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
            case "PAID": return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
            case "PACKED": return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
            case "SHIPPED": return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400";
            case "DELIVERED": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
            default: return "bg-zinc-100 text-zinc-600";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Orders</h1>
                    <p className="text-zinc-500 mt-1">Review orders and dispatch tracking information.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search order ID or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933] transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="text-zinc-400" size={18} />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="PACKED">Packed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-950 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Items</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {loading && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 italic">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FF9933]"/>
                                        Loading orders...
                                    </td>
                                </tr>
                            )}
                            {!loading && filtered.map(order => (
                                <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-100">{order.id.split('-')[0]}..</td>
                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{order.customerName}</div>
                                        <div className="text-xs text-zinc-500">{order.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{order.items?.length || 0}</td>
                                    <td className="px-6 py-4 font-medium">${order.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a 
                                            href={`/orders/${order.id}`}
                                            className="text-[#FF9933] hover:text-[#FF9933]/80 transition-colors font-medium">
                                            Update
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
