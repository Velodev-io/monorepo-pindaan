"use client";

import { useEffect, useState } from "react";
import { BookingStatus } from "@pinddaan/types";
import { BookingService } from "@/services/booking.service";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Wire mapping
        BookingService.getBookings()
            .then((res) => setBookings(res.data || []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Live Ritual Bookings</h1>
            <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm rounded-xl border border-zinc-200 dark:border-zinc-800">
                
                {/* Actions Bar */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-4 items-center bg-zinc-50 dark:bg-zinc-950/50">
                    <input 
                        type="search" 
                        placeholder="Search specific ID..." 
                        className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 max-w-sm w-full outline-amber-500"
                    />
                    <select className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-500 outline-amber-500">
                        <option value="">All Statuses</option>
                        {Object.values(BookingStatus).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-zinc-500 animate-pulse">Synchronizing vault...</div>
                ) : error ? (
                    <div className="p-12 text-center text-red-500">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Service</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {bookings.map(row => (
                                    <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                                            {row.user?.name || "Unknown Customer"}
                                            <div className="text-xs text-zinc-500 font-normal">Departed: {row.departedName}</div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500">{row.service?.name || "Pinddaan Custom"}</td>
                                        <td className="px-6 py-4 text-zinc-500">{new Date(row.ritualDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-500 border border-amber-500/20">
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-amber-600 dark:text-amber-500 hover:text-amber-700 font-medium">Process</button>
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr>
                                       <td colSpan={5} className="p-12 text-center text-zinc-500">No active bookings listed.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
