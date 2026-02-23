"use client";

import { useEffect, useState } from "react";
import { BookingStatus, Booking } from "@pinddaan/types";
import { BookingService } from "@/services/booking.service";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Wire mapping
        BookingService.getBookings()
            .then((res) => setBookings(res.data || []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
        try {
            await BookingService.updateStatus(id, newStatus);
            setBookings(prev => prev.map((b) => b.id === id ? { ...b, status: newStatus } : b));
        } catch (err: unknown) {
            alert("Failed to update status: " + (err as Error).message);
        }
    };

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
                                 {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                                            {booking.user?.name || "Unknown Customer"}
                                            <div className="text-xs text-zinc-500 font-normal mt-1">{booking.user?.email}</div>
                                            <div className="text-xs text-zinc-500 font-normal">{booking.user?.phone || "No phone provided"}</div>
                                            <div className="text-xs text-zinc-400 font-normal mt-1">Departed: {booking.departedName}</div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500">{booking.service?.name || "Pinddaan Ritual"}</td>
                                        <td className="px-6 py-4 text-zinc-500">{new Date(booking.ritualDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                                                booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-500/20 dark:bg-green-900/40 dark:text-green-500' :
                                                booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-500/20 dark:bg-amber-900/40 dark:text-amber-500' :
                                                'bg-zinc-100 text-zinc-800 border-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <select
                                                value={booking.status}
                                                onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                                                className="px-2 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-amber-500 cursor-pointer"
                                            >
                                                {Object.values(BookingStatus).map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
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
