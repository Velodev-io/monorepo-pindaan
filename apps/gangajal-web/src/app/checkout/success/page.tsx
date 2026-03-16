"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, HeartPulse, GraduationCap as Lotus, ShieldCheck } from "lucide-react";
import { Confetti } from "@/components/shared/Confetti"; // I'll create this or use a simple CSS one

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-saffron/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-water-blue/5 rounded-full blur-[120px] pointer-events-none" />

      {Confetti && mounted && <Confetti />}

      <div className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-2xl border border-white/5 p-8 md:p-16 rounded-[48px] shadow-2xl relative z-10 text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-10 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white font-serif mb-6 tracking-tight">
          Sacred Offering <br/>
          <span className="text-saffron italic">Confirmed.</span>
        </h1>

        <p className="text-slate-400 text-lg leading-relaxed mb-10 font-light max-w-md">
          Your reservation for the pure Himalayan Gangajal has been received with reverence. Our devotees are now preparing your specific batch for its journey.
        </p>

        <div className="w-full bg-white/5 rounded-3xl p-6 border border-white/5 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Order Identifier</p>
            <p className="text-white font-mono text-sm tracking-wider font-bold">#{orderId || 'HR-GNG-992'}</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-saffron/20 text-saffron rounded-full text-[10px] font-black uppercase tracking-widest border border-saffron/20">
               Awaiting Prep
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
           {[
             { icon: <HeartPulse size={20} />, label: "Soulful Purity" },
             { icon: <Lotus size={20} />, label: "Vedic Handling" },
             { icon: <ShieldCheck size={20} />, label: "Traceable Path" }
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-saffron">{item.icon}</div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{item.label}</span>
             </div>
           ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link href="/orders" className="flex-1">
            <button className="w-full py-5 bg-saffron text-white rounded-full font-black text-lg hover:bg-saffron/90 transition-all shadow-xl shadow-saffron/20 flex items-center justify-center gap-2">
              Track Status <Package size={20} />
            </button>
          </Link>
          <Link href="/" className="flex-1">
            <button className="w-full py-5 border border-white/10 text-slate-400 rounded-full font-bold text-lg hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2">
              Return Home <ArrowRight size={20} />
            </button>
          </Link>
        </div>

        <p className="mt-12 text-[11px] text-slate-500 font-medium italic">
          "A drop of Ganges water is a droplet of divine grace."
        </p>
      </div>
    </div>
  );
}
