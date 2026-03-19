"use client"

import { useState, useEffect } from "react";
import { AddressForm } from "@pinddaan/ui";
import { shippingAddressSchema } from "@pinddaan/schemas";
import { paymentProvider } from "@pinddaan/payments";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, HeartPulse, Loader2 } from "lucide-react";
import { Product } from "@pinddaan/types";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CheckoutPage() {
  const [volumes, setVolumes] = useState<any[]>([]);
  const [selectedVolume, setSelectedVolume] = useState<any>(null);
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login?redirect=/checkout");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api/v1";
    fetch(`${apiUrl}/products?isActive=true`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          const mapped = data.data.map((p: Product) => ({
            id: p.id,
            label: `${p.volumeMl >= 1000 ? p.volumeMl / 1000 + ' Liter' : p.volumeMl + 'ml'}`,
            price: p.price,
            title: p.name
          }));
          setVolumes(mapped);
          setSelectedVolume(mapped[0]); // Select first by default
        }
      })
      .catch(console.error);
  }, []);

  const subtotal = selectedVolume ? selectedVolume.price * quantity : 0;
  const shipping = 5.01;
  const total = subtotal + shipping;

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
      
      if (!selectedVolume) throw new Error("Please select a volume");

      // Generate items array for the order
      const items = [{
        id: selectedVolume.id,
        name: selectedVolume.title,
        title: selectedVolume.title, // Keep title for fallback in API
        label: selectedVolume.label, // Keep label for email volume fallback
        price: selectedVolume.price,
        quantity: quantity
      }];

      // Save order to DB and trigger emails via API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api/v1";
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          items,
          amount: total,
          shippingAddress: formData
        })
      });

      const apiData = await res.json();
      if (!apiData.success) {
         console.warn("Order setup error", apiData);
      }

      // Start mock payment
      const session = await paymentProvider.createCheckoutSession({
        amount: Math.round(total * 100),
        currency: "USD",
        successUrl: window.location.origin + `/checkout/success?orderId=${apiData.data?.id || 'PENDING'}`,
        cancelUrl: window.location.origin + "/checkout",
      });

      window.location.href = session.url;

    } catch (err: any) {
      if (err.errors) {
        // Zod validation errors
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e: any) => {
          if (e.path[0]) newErrors[e.path[0].toString()] = e.message;
        });
        setErrors(newErrors);
      } else {
        alert(err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => Math.max(1, q - 1));

  if (!selectedVolume) {
      return (
          <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
              <Loader2 className="w-8 h-8 text-saffron animate-spin mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Preparing the sacred offerings...</h2>
              <p className="text-slate-400">Loading available batches from the Himalayas</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Info */}
      <div className="bg-slate-900/30 border-b border-white/5 py-12 mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mx-auto w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center mb-6 border border-saffron/20">
                <ShoppingBag size={24} className="text-saffron" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white font-serif mb-4">Finalize Offering</h1>
            <p className="text-slate-400 font-medium font-sans italic">Bringing the holy Ganges from the Himalayas to your home.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Product Selection & Address */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Volume Selection */}
          <section className="bg-slate-900/50 backdrop-blur-xl p-10 rounded-[40px] border border-white/5 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8 font-serif flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center text-sm font-black">1</span>
              Select Sacred Volume
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {volumes.map((vol) => (
                <button
                  key={vol.id}
                  onClick={() => setSelectedVolume(vol)}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-2 ${
                    selectedVolume?.id === vol.id 
                    ? "border-saffron bg-saffron/10 shadow-inner" 
                    : "border-white/5 hover:border-white/10 bg-white/5"
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedVolume?.id === vol.id ? "text-saffron" : "text-slate-500"}`}>
                    {vol.title}
                  </span>
                  <span className="text-xl font-bold text-white">{vol.label}</span>
                  <span className="text-sm font-medium text-slate-400">${vol.price}</span>
                </button>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="font-bold text-white">Total Quantity</p>
                <p className="text-xs text-slate-400 font-medium font-sans">Select multiple for your puja or gifting.</p>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 self-start md:self-auto">
                <button 
                  onClick={decreaseQty}
                  className="w-12 h-12 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:border-saffron transition-all active:scale-90 shadow-sm"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center text-xl font-black text-white font-sans">{quantity}</span>
                <button 
                  onClick={increaseQty}
                  className="w-12 h-12 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:border-saffron transition-all active:scale-90 shadow-sm"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </section>

          {/* Shipping Information */}
          <section className="bg-slate-900/50 backdrop-blur-xl p-10 rounded-[40px] border border-white/5 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-8 font-serif flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center text-sm font-black">2</span>
              Delivery Address
            </h2>
            <div className="form-dark-theme-wrapper">
              <AddressForm 
                formData={formData} 
                onChange={setFormData} 
                errors={errors} 
              />
            </div>
          </section>
        </div>

        {/* Right Side: Sticky Order Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-saffron pointer-events-none">
                <ShoppingBag size={120} />
            </div>

            <h3 className="font-bold text-xl mb-8 text-white font-serif tracking-tight">Ritual Assembly</h3>
            
            <div className="space-y-6 text-sm mb-10 border-b border-white/5 pb-8">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-bold text-white text-base">{selectedVolume.label} Gangajal</p>
                  <p className="text-slate-500 font-medium font-sans mt-1">{selectedVolume.title} × {quantity}</p>
                </div>
                <span className="font-black text-white text-base italic underline decoration-saffron/30">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                    <Truck size={14} className="text-saffron" /> Global Shipping
                </div>
                <span className="font-bold text-white">${shipping.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-10">
              <span className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-500">Total Commitment</span>
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
