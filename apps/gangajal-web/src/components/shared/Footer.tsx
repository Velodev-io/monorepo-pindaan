import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, ShieldCheck, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-12 pb-10 text-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Link href="/" className="inline-block group">
            <Image 
              src="/images/logo.png" 
              alt="Hridganga Logo" 
              width={220} 
              height={80} 
              className="h-20 w-auto object-contain mix-blend-screen group-hover:scale-105 transition-transform origin-left" 
              style={{ width: 'auto' }}
            />
          </Link>
          <p className="max-w-md text-slate-400 text-sm leading-relaxed font-light">
            Bringing the sacred essence of the Ganges to your doorstep. We are committed to transparency, purity, and reverence in providing authentic Gangajal to devotees worldwide.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <a 
              href="mailto:tech@levenext.com" 
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-saffron transition-all group"
            >
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-saffron/10 transition-all">
                <Mail size={16} className="text-slate-500 group-hover:text-saffron" />
              </div>
              tech@levenext.com
            </a>
            <a 
              href="tel:+919369579563" 
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-saffron transition-all group"
            >
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-saffron/10 transition-all">
                <Phone size={16} className="text-slate-500 group-hover:text-saffron" />
              </div>
              +91 9369579563
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Quick Links</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-saffron transition-colors">Sacred Home</Link></li>
            <li><Link href="/orders" className="hover:text-saffron transition-colors">My Orders</Link></li>
            <li><Link href="/login" className="hover:text-saffron transition-colors">Devotee Login</Link></li>
            <li><Link href="/register" className="hover:text-saffron transition-colors">Join Registry</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Trust & Safety</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><span className="hover:text-saffron cursor-default transition-colors flex items-center gap-2"><ShieldCheck size={14} /> 100% Authentic</span></li>
            <li><span className="hover:text-saffron cursor-default transition-colors flex items-center gap-2"><MapPin size={14} /> Source Verified</span></li>
            <li><Link href="#" className="hover:text-saffron transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-saffron transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/5 text-[10px] text-slate-600 font-bold uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-6">
        <p>© {new Date().getFullYear()} HRIDGANGA. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 text-slate-500/50"><ShieldCheck size={12} /> SECURE SACRED LOGISTICS</span>
        </div>
      </div>
    </footer>
  );
}
