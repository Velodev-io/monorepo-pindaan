"use client";

import { useState } from "react";
import { Send, Plus, Search, MoreVertical } from "lucide-react";

export default function ShippingPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const mockRates = [
        { id: "R1", country: "US", zoneName: "United States (Continental)", baseRate: 5.01, perItemRate: 2.50, active: true },
        { id: "R2", country: "CA", zoneName: "Canada", baseRate: 8.50, perItemRate: 3.00, active: true },
        { id: "R3", country: "IN", zoneName: "India (Domestic)", baseRate: 1.00, perItemRate: 0.50, active: true },
        { id: "R4", country: "UK", zoneName: "United Kingdom", baseRate: 9.00, perItemRate: 3.50, active: false }
    ];

    const filtered = mockRates.filter(r => r.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) || r.country.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Shipping Rates</h1>
                    <p className="text-zinc-500 mt-1">Manage delivery zones and fulfillment costs.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#FF9933] text-white rounded-xl font-medium hover:bg-[#FF9933]/90 transition-all shadow-sm">
                    <Plus size={18} />
                    Add Zone
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by zone or country code..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933] transition-all"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-950 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Zone</th>
                                <th className="px-6 py-4 font-medium">Country Code</th>
                                <th className="px-6 py-4 font-medium">Base Rate</th>
                                <th className="px-6 py-4 font-medium">Per Item Rate</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {filtered.map(rate => (
                                <tr key={rate.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <Send size={16} />
                                        </div>
                                        {rate.zoneName}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-zinc-600 dark:text-zinc-400">{rate.country}</td>
                                    <td className="px-6 py-4 font-medium">${rate.baseRate.toFixed(2)}</td>
                                    <td className="px-6 py-4 font-medium">${rate.perItemRate.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${rate.active ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400' : 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800'}`}>
                                            {rate.active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                        No shipping rates found matching "{searchTerm}"
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
