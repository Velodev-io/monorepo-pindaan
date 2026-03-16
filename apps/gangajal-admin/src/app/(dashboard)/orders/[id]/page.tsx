"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { OrderService } from "@/services/order.service";

export default function EditOrderPage() {
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        status: "PENDING",
        trackingNumber: "",
        carrier: "",
        adminNotes: ""
    });

    useEffect(() => {
        fetchOrder();
    }, [params.id]);

    const fetchOrder = async () => {
        try {
            const res = await OrderService.getById(params.id as string);
            if (res.data) {
                setFormData({
                    status: res.data.status || "PENDING",
                    trackingNumber: res.data.trackingNumber || "",
                    carrier: res.data.carrier || "",
                    adminNotes: res.data.adminNotes || ""
                });
            }
        } catch (error) {
            console.error("Failed to fetch order", error);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await OrderService.update(params.id as string, formData);
            router.push("/orders");
        } catch (error) {
            console.error("Failed to update order", error);
            alert("Failed to update order");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-12 text-center text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#FF9933]" />
            Loading order details...
        </div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/orders" className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-sm">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Update Order
                    </h1>
                    <p className="text-zinc-500 mt-1">
                        Editing details for order {(params.id as string).split('-')[0]}..
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 overflow-hidden space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Order Status</label>
                        <select 
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="PACKED">Packed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tracking Number</label>
                        <input 
                            type="text" 
                            name="trackingNumber"
                            value={formData.trackingNumber}
                            onChange={handleChange}
                            placeholder="e.g. 1Z9999999999999999"
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Carrier</label>
                        <input 
                            type="text" 
                            name="carrier"
                            value={formData.carrier}
                            onChange={handleChange}
                            placeholder="e.g. FedEx, UPS, DHL"
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]"
                        />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Admin Notes</label>
                        <textarea 
                            name="adminNotes"
                            value={formData.adminNotes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Internal notes about this order..."
                            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 focus:border-[#FF9933]"
                        />
                    </div>

                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800 gap-3">
                    <Link href="/orders" className="px-5 py-2.5 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        Cancel
                    </Link>
                    <button 
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#FF9933] text-white rounded-xl font-medium hover:bg-[#FF9933]/90 transition-all shadow-sm disabled:opacity-50">
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? "Saving..." : "Update Order"}
                    </button>
                </div>
            </form>
        </div>
    );
}
