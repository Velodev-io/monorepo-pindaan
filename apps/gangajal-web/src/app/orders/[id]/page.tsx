"use client"

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import VerificationVideoCard from "@/components/shared/VerificationVideoCard";

// Mock fetching function for localhost
const getOrderDetails = (id: string) => {
    return {
        id: id,
        userId: "user-123",
        items: [
            { id: "item-1", productId: "prod-1", name: "Gangajal (500ml)", quantity: 1, price: 25 }
        ],
        amount: 25,
        currency: "USD",
        status: "SHIPPED",
        paymentStatus: "SUCCESS",
        shippingAddress: {
            name: "Rahul Sharma",
            phone: "+91 98765 43210",
            line1: "123 Devotional Lane",
            city: "Varanasi",
            state: "Uttar Pradesh",
            postalCode: "221001",
            country: "India"
        },
        proofVideo: {
            status: "AVAILABLE",
            videoUrl: "/videos/sample-proof.mp4",
            recordedAt: new Date().toISOString(),
            notes: "Prepared and sealed with care at the holy banks."
        },
        createdAt: "2026-02-23T10:00:00Z",
        updatedAt: "2026-02-23T14:30:00Z"
    };
};

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id as string;
    const order = getOrderDetails(orderId);

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 min-h-screen">
            <Link 
                href="/orders" 
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-10 group"
            >
                <ArrowLeft size={18} className="transform transition-transform group-hover:-translate-x-1" />
                <span className="font-bold text-sm uppercase tracking-widest">Back to My Orders</span>
            </Link>

            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-4xl font-bold text-slate-900 font-serif tracking-tight">Order Details</h1>
                             <span className="px-4 py-1.5 rounded-full bg-saffron/10 text-saffron text-[10px] font-black uppercase tracking-widest border border-saffron/20">
                                {order.status}
                             </span>
                        </div>
                        <p className="text-slate-500 font-medium">Order ID: #{order.id}</p>
                    </div>

                    {/* Verification Video Section (Primary Feature) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-saffron">
                            <ShieldCheck size={20} />
                            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Authenticity Verification</h3>
                        </div>
                        <VerificationVideoCard order={order as any} />
                    </div>

                    {/* Order Items */}
                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-xl shadow-slate-200/50">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 font-serif">Items Purchased</h3>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                                            <Package size={24} className="text-slate-300" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{item.name}</p>
                                            <p className="text-slate-500 text-sm italic">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-xl text-slate-900 font-serif">${item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Shipping & Payment */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <MapPin className="text-saffron" size={20} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Shipping Destination</h4>
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-lg text-saffron">{order.shippingAddress.name}</p>
                            <p className="text-white/70 text-sm leading-relaxed">
                                {order.shippingAddress.line1}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/10">
                             <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/40">Total Amount</p>
                                <p className="text-2xl font-black text-saffron font-serif">${order.amount}</p>
                             </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard className="text-slate-400" size={20} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Payment Status</h4>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 uppercase text-xs tracking-widest">Method</span>
                            <span className="text-slate-500 text-sm font-medium">Stripe Secure</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <span className="font-bold text-slate-900 uppercase text-xs tracking-widest">Status</span>
                            <span className="text-emerald-500 text-sm font-bold uppercase tracking-widest">{order.paymentStatus}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
