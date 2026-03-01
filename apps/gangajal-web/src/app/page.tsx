import Link from "next/link";
import { Droplets, Globe, PackageCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background Fallback / Container */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src="/videos/hero-background.mp4"
          />
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.2) 100%)' 
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-saffron/20 bg-saffron/5 text-saffron text-[10px] font-bold tracking-[0.2em] uppercase mb-10 backdrop-blur-sm shadow-sm ring-1 ring-white/20">
            <span className="text-sm">🏔️</span> Sourced from the Himalayas
          </div>

          <h1 className="text-5xl md:text-8xl font-bold mb-6 font-serif leading-[1.1] text-slate-900 tracking-tight drop-shadow-[0_2px_15px_rgba(255,255,255,0.8)]">
            Sacred <span className="text-saffron">Gangajal</span>,<br />
            <span className="text-slate-500 block mt-2 italic font-light text-4xl md:text-6xl">Delivered Worldwide.</span>
          </h1>

          <p className="text-xl text-slate-600/90 max-w-[600px] mx-auto mb-14 leading-relaxed font-light">
            Bringing the pure spiritual essence of the holy Ganges directly from the Himalayas to your home, preserved in its most pristine form.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link 
              href="/checkout" 
              className="group relative overflow-hidden px-10 py-5 bg-saffron text-white rounded-full font-bold text-lg transition-all hover:bg-saffron/90 hover:scale-105 active:scale-95 shadow-xl shadow-saffron/20 font-sans"
            >
              <span className="flex items-center gap-2 relative z-10">
                Order Pure Gangajal <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link 
              href="/orders" 
              className="px-10 py-5 border border-slate-200 text-slate-700 bg-white/50 rounded-full font-semibold text-lg hover:bg-white hover:border-saffron/30 hover:text-saffron transition-all backdrop-blur-sm shadow-sm font-sans"
            >
              Track My Order
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[11px] font-bold text-slate-600/70 tracking-[0.12em] uppercase mt-12 bg-white/30 backdrop-blur-md py-4 px-8 rounded-2xl border border-white/50 shadow-sm inline-flex">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-saffron" /> Export Certified</div>
            <span className="opacity-20 hidden md:block">•</span>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-saffron" /> Tamper-Proof Sealed</div>
            <span className="opacity-20 hidden md:block">•</span>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-saffron" /> Ships to 150+ Countries</div>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="relative -mt-1 group">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="animate-wave">
          <path
            fill="var(--background)"
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
      </div>

      {/* Sacred Offering / Booking Details Section */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-block px-5 py-2 bg-saffron/10 text-saffron rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-8 shadow-sm">
                Limited Sacred Batch
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 font-serif leading-[1.1] tracking-tight">
                High-Altitude <br/>
                <span className="text-saffron italic">Sacred Extraction.</span>
              </h2>
              <p className="text-slate-600 text-xl mb-12 leading-relaxed font-light">
                Our Gangajal is hand-filled during the most auspicious <span className="text-saffron font-medium">Brahma Muhurta</span> hours, when the Himalayan currents are most potent and energetically pure.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12 mb-16">
                {[
                  { title: "Volume", detail: "500ml Sacred Flow", icon: <Droplets size={20} /> },
                  { title: "Heritage", detail: "10,000+ ft Altitude", icon: <Globe size={20} /> },
                  { title: "Seal", detail: "Vedic Wax Sealing", icon: <PackageCheck size={20} /> },
                  { title: "Purity", detail: "Export Certified", icon: <CheckCircle2 size={20} /> }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-3 group">
                    <div className="flex items-center gap-3 text-saffron">
                      {item.icon}
                      <span className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.title}</span>
                    </div>
                    <span className="text-slate-900 font-bold text-lg">{item.detail}</span>
                  </div>
                ))}
              </div>
              
              <Link 
                href="/checkout" 
                className="group inline-flex items-center gap-4 px-12 py-6 bg-slate-900 text-white rounded-full font-bold text-xl hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-2xl shadow-slate-400/20 active:scale-95"
              >
                Book This Batch <span className="opacity-40 font-light ml-2">|</span> <span className="text-saffron">$25.00</span>
                <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
            
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              <div className="aspect-[4/5] bg-slate-50 rounded-[64px] overflow-hidden relative group border border-slate-100 shadow-2xl">
                {/* Gangotri Source Image */}
                <img 
                  src="/images/gangotri.png" 
                  alt="Sacred Gangotri Source" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Saffron Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                
                {/* Saffron Glows */}
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-saffron/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-water-blue/20 rounded-full blur-[100px] animate-pulse delay-500" />
                
                {/* Heritage Label */}
                <div className="absolute bottom-12 left-12 right-12 bg-white/60 backdrop-blur-xl border border-white/40 p-8 rounded-[32px] shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Source Coordinates</p>
                      <p className="text-slate-900 font-bold text-sm tracking-tight italic">30.9947° N, 78.9398° E (Gangotri)</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-saffron/30 flex items-center justify-center">
                      <div className="w-2 h-2 bg-saffron rounded-full animate-ping" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Review Card */}
              <div className="absolute -top-10 -right-10 bg-white p-8 rounded-[32px] shadow-2xl border border-slate-100 max-w-[280px] hidden xl:block animate-bounce-subtle">
                <p className="text-slate-800 font-serif italic text-lg mb-4 leading-relaxed">"The water feels alive, as if the river is right here."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-[10px] font-black text-saffron border border-saffron/20">AK</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Anjali K.</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Houston, USA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-serif tracking-tight">Why Devotees Trust Us</h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full opacity-60" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Droplets size={28} />,
                title: "100% Spiritual Purity",
                desc: "Sourced with Vedic precision from the most auspicious Himalayan currents, preserving the water's sacred essence."
              },
              {
                icon: <Globe size={28} />,
                title: "Seamless Global Access",
                desc: "Bringing the holy Ganges to your doorstep in over 150 countries through our dedicated international spiritual logistics."
              },
              {
                icon: <PackageCheck size={28} />,
                title: "Sacred Export Standards",
                desc: "Each bottle is export-certified and hermetically sealed in premium materials to maintain purity indefinitely."
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="group p-10 bg-white border-t-4 border-gold rounded-[24px] transition-all duration-300 hover:-translate-y-2 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)]"
              >
                <div className="w-16 h-16 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron mb-8 transition-colors group-hover:bg-saffron/20 group-hover:scale-110 duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-[1.8]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Light Blue Gradient */}
      <section className="py-32 px-4 border-y border-black/5 bg-shimmer">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-20 tracking-tight">The Impact of Devotion</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            {[
              { val: "10,000+", label: "Orders Delivered" },
              { val: "150+", label: "Countries Reached" },
              { val: "100%", label: "Pure Source Authenticated" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-6xl font-black text-gold mb-4 font-serif italic underline decoration-gold/30 underline-offset-[12px]">{stat.val}</span>
                <span className="text-sm font-bold tracking-[0.15em] text-foreground/70 mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Visual Touch */}
      <div className="h-40 bg-background" />
    </div>
  );
}
