"use client"

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { User as UserIcon, Mail, MapPin, Package, ChevronRight, ShieldCheck } from "lucide-react";

// Mock orders for the profile page
const RECENT_ORDERS = [
    {
        id: "ORD-9821-YX",
        date: "Feb 23, 2026",
        status: "SHIPPED",
        amount: "$25.00",
        proofStatus: "AVAILABLE"
    }
];

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading profile...</div>;
    }

    if (!user) {
        return (
            <div className="max-w-md mx-auto py-32 px-4 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <UserIcon className="text-slate-200" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 font-serif">Sign in to view profile</h2>
                <p className="text-slate-500 mb-8 font-medium">Please log in to manage your orders and view verification videos.</p>
                <Link href="/login">
                    <button className="w-full bg-saffron text-white h-14 rounded-full font-bold shadow-xl shadow-saffron/20 hover:bg-saffron/90 transition-all">
                        Log In Now
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-20 min-h-screen">
            <div className="grid md:grid-cols-3 gap-12">
                {/* User Stats/Info Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white border border-slate-100 rounded-[40px] p-10 text-center shadow-xl shadow-slate-200/50">
                        <div className="w-24 h-24 bg-saffron rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-black shadow-lg shadow-saffron/30">
                            {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 font-serif leading-tight">{user.displayName || "Sacred Devotee"}</h2>
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-3 font-medium">
                            <Mail size={14} /> {user.email}
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-[40px] p-10 shadow-2xl">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">Account Settings</h4>
                         <div className="space-y-6">
                            <button className="flex items-center gap-4 w-full text-left group">
                                <MapPin size={20} className="text-saffron group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-sm uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">Stored Addresses</span>
                            </button>
                            <Link href="/orders" className="flex items-center gap-4 w-full text-left group">
                                <Package size={20} className="text-saffron group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-sm uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">Order History</span>
                            </Link>
                            <button 
                                onClick={() => auth.signOut()}
                                className="flex items-center gap-4 w-full text-left group text-red-400"
                            >
                                <span className="font-bold text-sm uppercase tracking-widest">Sign Out</span>
                            </button>
                         </div>
                    </div>
                </div>

                {/* Main Content: Recent Orders & Verification List */}
                <div className="md:col-span-2 space-y-12">
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900 font-serif tracking-tight mb-2">Sacred Orders</h3>
                        <p className="text-slate-500 font-medium">Manage your requests and witness the preparation of your orders.</p>
                    </div>

                    <div className="space-y-6">
                        {RECENT_ORDERS.map((order) => (
                            <div key={order.id} className="bg-white border border-slate-50 rounded-[32px] p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-all hover:shadow-xl hover:shadow-slate-200/40 border-l-4 border-l-saffron">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg text-slate-900">{order.id}</span>
                                        <span className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-full">{order.status}</span>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">{order.date} · {order.amount}</p>
                                    
                                    {/* Verification Badge */}
                                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-saffron/5 border border-saffron/10 text-saffron rounded-xl">
                                        <ShieldCheck size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {order.proofStatus === "AVAILABLE" ? "Verification Video Ready" : "Preparing Verification"}
                                        </span>
                                    </div>
                                </div>
                                <Link 
                                    href={`/orders/${order.id}`}
                                    className="flex items-center gap-2 px-6 py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-saffron hover:text-white transition-all group shadow-sm"
                                >
                                    {order.proofStatus === "AVAILABLE" ? "View Proof" : "Order Details"} <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        ))}

                        {RECENT_ORDERS.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No recent orders found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
