import Link from "next/link";
import Image from "next/image";
import { Droplets, Globe, PackageCheck, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import ReviewButton from "../components/reviews/ReviewButton";
import ReviewsList from "../components/reviews/ReviewsList";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden font-sans bg-background">
      {/* 3D Background Elements - Floating Lotuses */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[5%] w-64 h-64 opacity-20 animate-float-3d delay-700 blur-[2px]">
          <Image src="/images/3d-lotus.png" alt="" width={256} height={256} className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-[60%] right-[2%] w-80 h-80 opacity-15 animate-float-3d delay-1000 blur-[1px]">
          <Image src="/images/3d-lotus.png" alt="" width={320} height={320} className="w-full h-full object-contain rotate-45" />
        </div>
        <div className="absolute bottom-[10%] left-[15%] w-48 h-48 opacity-10 animate-float-3d delay-300 blur-[3px]">
          <Image src="/images/3d-lotus.png" alt="" width={192} height={192} className="w-full h-full object-contain -rotate-12" />
        </div>
      </div>

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
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, var(--background) 100%)' 
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-saffron/20 bg-saffron/5 text-saffron text-[10px] font-bold tracking-[0.2em] uppercase mb-10 backdrop-blur-sm shadow-sm ring-1 ring-white/20">
            <span className="text-sm">🏔️</span> Sourced from the Himalayas
          </div>

          <h1 className="text-5xl md:text-8xl font-bold mb-6 font-serif leading-[1.1] text-white tracking-tight drop-shadow-[0_2px_15px_rgba(34,211,238,0.3)]">
            Hrid<span className="text-saffron">ganga</span>,<br />
            <span className="text-slate-400 block mt-2 italic font-light text-4xl md:text-6xl">Delivered Worldwide.</span>
          </h1>

          <p className="text-xl text-slate-300 max-w-[600px] mx-auto mb-14 leading-relaxed font-light">
            Bringing the pure spiritual essence of the holy Ganges directly from the Himalayas to your home, preserved in its most pristine form.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16 max-w-sm mx-auto sm:max-w-none">
            <Link 
              href="/checkout" 
              className="w-full sm:w-auto group relative overflow-hidden px-8 py-4 sm:px-10 sm:py-5 bg-saffron text-white rounded-full font-bold text-lg transition-all hover:bg-saffron/90 hover:scale-105 active:scale-95 shadow-xl shadow-saffron/20 font-sans"
            >
              <span className="flex items-center justify-center gap-2 relative z-10 whitespace-nowrap">
                Order Pure Gangajal <ArrowRight size={20} className="flex-shrink-0 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link 
              href="/orders" 
              className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 border border-white/10 text-slate-300 bg-white/5 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-saffron/30 hover:text-white transition-all backdrop-blur-sm shadow-sm font-sans flex items-center justify-center whitespace-nowrap"
            >
              Track My Order
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[11px] font-bold text-slate-400 tracking-[0.12em] uppercase mt-12 bg-white/5 backdrop-blur-md py-4 px-8 rounded-2xl border border-white/10 shadow-sm inline-flex">
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
      <section className="py-32 px-4 bg-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-block px-5 py-2 bg-saffron/10 text-saffron rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-8 shadow-sm">
                Limited Sacred Batch
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 font-serif leading-[1.1] tracking-tight">
                Gateway to the <br/>
                <span className="text-saffron italic">Divine Rishikesh.</span>
              </h2>
              <p className="text-slate-300 text-xl mb-12 leading-relaxed font-light">
                Our Gangajal is hand-filled from the sacred banks of Rishikesh—the Gateway to the Gods. Easily reachable from Delhi, this sacred site offers the most accessible yet pure Himalayan currents for your spiritual rituals.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12 mb-16">
                {[
                  { title: "Volume", detail: "500ml Sacred Flow", icon: <Droplets size={20} /> },
                  { title: "Heritage", detail: "Gateway to the Gods", icon: <Globe size={20} /> },
                  { title: "Seal", detail: "Vedic Wax Sealing", icon: <PackageCheck size={20} /> },
                  { title: "Purity", detail: "Export Certified", icon: <CheckCircle2 size={20} /> }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-3 group perspective-1000">
                    <div className="flex items-center gap-3 text-saffron transition-transform group-hover:translate-z-10">
                      {item.icon}
                      <span className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">{item.title}</span>
                    </div>
                    <span className="text-white font-bold text-lg group-hover:text-saffron transition-colors">{item.detail}</span>
                  </div>
                ))}
              </div>
              
              <Link 
                href="/checkout" 
                className="group inline-flex items-center gap-4 px-12 py-6 bg-white text-slate-900 rounded-full font-bold text-xl hover:bg-slate-100 transition-all hover:scale-[1.02] shadow-2xl shadow-white/5 active:scale-95"
              >
                Book This Batch <span className="opacity-40 font-light ml-2">|</span> <span className="text-saffron">$25.00</span>
                <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
            
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              <div className="aspect-[4/5] bg-slate-900 rounded-[64px] overflow-hidden relative group border border-white/5 shadow-2xl">
                {/* Rishikesh Source Image */}
                <Image 
                  src="/images/rishikesh.png" 
                  alt="Sacred Rishikesh Bank" 
                  fill
                  className="object-cover opacity-80"
                />
                
                {/* Saffron Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                
                {/* Saffron Glows */}
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-saffron/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-water-blue/10 rounded-full blur-[100px] animate-pulse delay-500" />
                
                {/* Heritage Label */}
                <div className="absolute bottom-12 left-12 right-12 bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Source Coordinates</p>
                      <p className="text-white font-bold text-sm tracking-tight italic">30.1225° N, 78.3129° E (Rishikesh)</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-saffron/30 flex items-center justify-center">
                      <div className="w-2 h-2 bg-saffron rounded-full animate-ping" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Review Card */}
              <div className="absolute -top-10 -right-10 bg-slate-800/90 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-white/5 max-w-[280px] hidden xl:block animate-bounce-subtle">
                <p className="text-slate-100 font-serif italic text-lg mb-4 leading-relaxed">"The water feels alive, as if the river is right here."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-[10px] font-black text-saffron border border-saffron/20">AK</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white uppercase tracking-widest">Anjali K.</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Houston, USA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voices of Devotion - Reviews Section */}
      <section className="py-32 px-4 bg-background relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-saffron/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-water-blue/5 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight">
              Voices of <span className="text-saffron italic">Devotion.</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed font-light mb-10">
              Devotees from across the globe share their experiences of receiving the sacred Himalayan currents.
            </p>
            <ReviewButton />
          </div>

          <ReviewsList />
        </div>
      </section>

      {/* Sacred Traditions & Usage Section */}
      <section className="py-32 px-4 bg-slate-900/20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight">
              Sacred <span className="text-saffron italic">Traditions & Usage.</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed font-light">
              For millennia, Gangajal has been the cornerstone of spiritual purity, used across generations to sanctify homes and elevate the soul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Daily Puja",
                description: "Used to purify the altar and home before daily prayers, inviting divine energy into the living space.",
                icon: "✨"
              },
              {
                title: "Life Sanskaras",
                description: "Essential for births, weddings, and last rites, ensuring the presence of the holy Ganges during life's most sacred milestones.",
                icon: "🌿"
              },
              {
                title: "Spiritual Healing",
                description: "Consumed or sprinkled for mental clarity and spiritual restoration, believed to wash away negative karmic vibrations.",
                icon: "🕉️"
              },
              {
                title: "Divine Heritage",
                description: "Scientifically unique—the only water on Earth that remains fresh for years, carrying the minerals of the sacred Himalayas.",
                icon: "🏔️"
              }
            ].map((usage, idx) => (
              <div key={idx} className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[32px] hover:border-saffron/20 transition-all group hover-3d preserve-3d perspective-1000">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10 w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 translate-z-10">
                  {usage.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-4 font-serif group-hover:text-saffron transition-colors">{usage.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{usage.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 p-12 bg-white/5 rounded-[48px] border border-white/5 backdrop-blur-sm relative overflow-hidden hover-3d transition-transform duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-6 font-serif">A Remarkable Quality</h3>
                <p className="text-slate-300 leading-relaxed font-light">
                  Known as <span className="text-saffron font-medium">"Prana-Shakti"</span>, the sacred Ganges water contains high levels of dissolved oxygen and unique bacteriophages. Even ancient travelers recorded that Gangajal sealed in copper vessels would remain pristine for years, retaining its spiritual and physical purity across oceans.
                </p>
              </div>
              <div className="w-px h-32 bg-white/10 hidden md:block" />
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-6 font-serif">Vedic Significance</h3>
                <p className="text-slate-300 leading-relaxed font-light">
                  In the Puranas, it is said that a single drop of Gangajal is enough to liberate the soul from the cycle of birth and death. It is the liquid form of the Divine Mother, descending to Earth to purify humanity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="pt-24 pb-12 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-serif tracking-tight">Why Devotees Trust Us</h2>
            <div className="w-20 h-1 bg-saffron mx-auto rounded-full opacity-60" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Droplets size={28} />,
                title: "100% Spiritual Purity",
                desc: "Sourced with Vedic precision from the most auspicious Himalayan currents, preserving the water's sacred essence."
              },
              {
                icon: <ShieldCheck size={28} />,
                title: "Verification Video",
                desc: "A unique transparency measure showing your specific order being prepared and sealed with reverence."
              },
              {
                icon: <PackageCheck size={28} />,
                title: "Sacred Export Standards",
                desc: "Each bottle is export-certified and hermetically sealed in premium materials to maintain purity indefinitely."
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="group p-10 bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-[24px] transition-all duration-300 hover:shadow-2xl hover:shadow-saffron/5 hover-3d preserve-3d"
              >
                <div className="w-16 h-16 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron mb-8 transition-colors group-hover:bg-saffron/20 group-hover:translate-z-10 duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-saffron transition-colors">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-[1.8]">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* New USP Section: Transparency with Reverence */}
          <div className="mt-20 bg-slate-900 rounded-[48px] p-8 md:p-16 relative overflow-hidden shadow-2xl hover-3d transition-all duration-700">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                  <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                      <source src="/videos/hero-background.mp4" type="video/mp4" />
                  </video>
              </div>
              <div className="relative z-10 max-w-2xl translate-z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-saffron/20 text-saffron rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                      <ShieldCheck size={14} /> Trust Through Devotion
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">Transparency with Reverence</h2>
                  <p className="text-white/70 text-lg mb-10 leading-relaxed font-light">
                      For many orders, we provide a short verification video showing the preparation and sealing of your specific Gangajal—so you can feel assured with dignity and trust that the sacred essence has been handled with the utmost respect.
                  </p>
                  <Link href="/orders">
                      <button className="bg-saffron hover:bg-saffron/90 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-saffron/20">
                          See How It Works
                      </button>
                  </Link>
              </div>
          </div>
        </div>
      </section>

    </div>
  );
}
