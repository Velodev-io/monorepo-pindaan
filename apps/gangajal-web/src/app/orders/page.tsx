"use client"

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";

// TODO: Replace with real orders fetched from API once backend is ready
const MOCK_ORDERS = [
  {
    id: "ORD-9821-YX",
    date: "Feb 23, 2026",
    status: "SHIPPED",
    items: "Gangajal (500ml) × 1",
    total: "$25.00",
  },
];

function OrdersContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {isSuccess && (
        <div className="mb-10 p-8 bg-emerald-50 border border-emerald-100 rounded-[32px] flex items-center gap-6 shadow-sm">
          <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <h4 className="font-bold text-xl text-emerald-900 font-serif tracking-tight">Order Placed Successfully!</h4>
            <p className="text-emerald-700/80 font-medium mt-1">
              A confirmation email has been sent to you. Your sacred Gangajal will be dispatched with the utmost care.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-12">
        <h1 className="text-4xl font-bold text-slate-900 font-serif tracking-tight">Your Orders</h1>
        <Link
          href="/"
          className="text-sm font-bold text-saffron hover:text-saffron/80 transition-colors uppercase tracking-[0.1em] border-b-2 border-saffron/20 pb-0.5"
        >
          Back to Shop
        </Link>
      </div>

      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => (
          <div
            key={order.id}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-saffron/10 flex items-center justify-center text-saffron">
                <Package size={22} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-slate-900">{order.id}</span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    {order.status}
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium">{order.date} · {order.items}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-2xl text-slate-900 font-serif">{order.total}</p>
              <button className="text-xs font-bold text-saffron mt-2 hover:text-saffron/80 transition-all uppercase tracking-widest">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
