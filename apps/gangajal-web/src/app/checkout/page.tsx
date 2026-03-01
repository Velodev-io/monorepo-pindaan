"use client"

import { useState } from "react";
import { AddressForm } from "@pinddaan/ui";
import { shippingAddressSchema } from "@pinddaan/schemas";
import { paymentProvider } from "@pinddaan/payments";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, HeartPulse } from "lucide-react";

const VOLUMES = [
  { id: "250ml", label: "250ml", price: 12.99, title: "Sacred Essence" },
  { id: "500ml", label: "500ml", price: 19.99, title: "Standard Vessel" },
  { id: "1l", label: "1 Liter", price: 34.99, title: "Devotional Volume" },
  { id: "5l", label: "5 Liters", price: 149.99, title: "Akhanda Ritual" },
];

export default function CheckoutPage() {
  const [selectedVolume, setSelectedVolume] = useState(VOLUMES[1]); // Default to 500ml
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    landmark: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Validate address
      const result = shippingAddressSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: any = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      const shipping = 5.01;
      const subtotalAmt = selectedVolume.price * quantity;
      const totalAmount = subtotalAmt + shipping;

      // Generate a simple order ID
      const orderId = `GJ-${Date.now().toString(36).toUpperCase()}`;

      // Fire order confirmation emails (customer + admin) — non-blocking
      fetch("/api/send-order-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email || `order+${orderId.toLowerCase()}@gangajal.store`,
          orderId,
          items: [
            {
              name: `${selectedVolume.label} Gangajal`,
              volume: selectedVolume.label,
              quantity,
              price: selectedVolume.price,
            },
          ],
          subtotal: subtotalAmt,
          shipping,
          total: totalAmount,
          shippingAddress: {
            name: formData.name,
            line1: formData.line1,
            line2: formData.line2,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        }),
      }).catch((e) => console.warn("[Email] Non-critical email send error:", e));

      // Start mock payment
      const session = await paymentProvider.createCheckoutSession({
        amount: Math.round(totalAmount * 100),
        currency: "USD",
        successUrl: window.location.origin + "/orders?success=true",
        cancelUrl: window.location.origin + "/checkout",
      });

      window.location.href = session.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => Math.max(1, q - 1));

  const subtotal = selectedVolume.price * quantity;
  const shipping = 5.01;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-24">
      {/* Header Info */}
      <div className="bg-white border-b border-slate-100 py-12 mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mx-auto w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={24} className="text-saffron" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-serif mb-4">Finalize Offering</h1>
            <p className="text-slate-500 font-medium font-sans">Bringing the holy Ganges from the Himalayas to your home.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Product Selection & Address */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Volume Selection */}
          <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 font-serif flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center text-sm font-black">1</span>
              Select Sacred Volume
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {VOLUMES.map((vol) => (
                <button
                  key={vol.id}
                  onClick={() => setSelectedVolume(vol)}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-2 ${
                    selectedVolume.id === vol.id 
                    ? "border-saffron bg-saffron/5 shadow-inner" 
                    : "border-slate-50 hover:border-slate-200 bg-white"
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedVolume.id === vol.id ? "text-saffron" : "text-slate-400"}`}>
                    {vol.title}
                  </span>
                  <span className="text-xl font-bold text-slate-900">{vol.label}</span>
                  <span className="text-sm font-medium text-slate-500">${vol.price}</span>
                </button>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="font-bold text-slate-900">Total Quantity</p>
                <p className="text-xs text-slate-400 font-medium font-sans">Select multiple for your puja or gifting.</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 self-start md:self-auto">
                <button 
                  onClick={decreaseQty}
                  className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-saffron hover:border-saffron transition-all active:scale-90 shadow-sm"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center text-xl font-black text-slate-900 font-sans">{quantity}</span>
                <button 
                  onClick={increaseQty}
                  className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-saffron hover:border-saffron transition-all active:scale-90 shadow-sm"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </section>

          {/* Shipping Information */}
          <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 font-serif flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center text-sm font-black">2</span>
              Delivery Address
            </h2>
            <AddressForm 
              formData={formData} 
              onChange={setFormData} 
              errors={errors} 
            />
          </section>
        </div>

        {/* Right Side: Sticky Order Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-saffron pointer-events-none">
                <ShoppingBag size={120} />
            </div>

            <h3 className="font-bold text-xl mb-8 text-slate-900 font-serif tracking-tight">Ritual Assembly</h3>
            
            <div className="space-y-6 text-sm mb-10 border-b border-slate-50 pb-8">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-base">{selectedVolume.label} Gangajal</p>
                  <p className="text-slate-400 font-medium font-sans mt-1">{selectedVolume.title} × {quantity}</p>
                </div>
                <span className="font-black text-slate-900 text-base italic underline decoration-saffron/30">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                    <Truck size={14} className="text-saffron" /> Global Shipping
                </div>
                <span className="font-bold text-slate-900">${shipping.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-10">
              <span className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Total Commitment</span>
              <span className="text-4xl font-black text-saffron drop-shadow-sm font-serif">${total.toFixed(2)}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-6 bg-saffron text-white rounded-[24px] font-black text-xl hover:bg-saffron/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-saffron/30"
            >
              {loading ? "Preparing Offering..." : "Proceed to Payment"}
            </button>

            <div className="mt-8 flex flex-col gap-4 text-center">
              <div className="flex flex-wrap items-center justify-center gap-4 border-t border-slate-50 pt-8">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" /> Secure
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <HeartPulse size={14} className="text-rose-500" /> Authentic
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center px-6 text-[11px] text-slate-400 leading-relaxed italic">
            "We treat every bottle with the same reverence as the river itself."
          </p>
        </div>

      </div>
    </div>
  );
}
