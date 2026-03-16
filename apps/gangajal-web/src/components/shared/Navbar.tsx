"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const lotusIcon = (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-saffron drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s-2.5-3.5-2.5-6.5S12 11 12 11s2.5 1.5 2.5 4.5-2.5 6.5-2.5 6.5zM7 20s-1.5-4-1.5-6S7 9 7 9s2.5 2.5 2.5 5-2.5 6-2.5 6zm10 0s1.5-4 1.5-6S17 9 17 9s-2.5 2.5-2.5 5 2.5 6 2.5 6zM4 14s.5-5 3.5-7S12 5 12 5s-5 0-8 2-3.5 7-3.5 7zm16 0s-.5-5-3.5-7S12 5 12 5s5 0 8 2 3.5 7 3.5 7z"/>
    </svg>
  );

  return (
    <nav className="h-20 border-b border-white/5 px-6 flex items-center justify-between sticky top-0 bg-nav-bg backdrop-blur-md z-50">
      <Link href="/" className="flex items-center gap-3 group">
        {lotusIcon}
        <span className="font-bold text-2xl tracking-tighter text-white font-serif group-hover:text-saffron transition-colors">
          Hrid<span className="text-saffron italic">ganga</span>
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <Link href="/orders" className="text-sm font-medium text-slate-400 hover:text-white transition-all font-sans">Orders</Link>
        {user ? (
          <div className="flex items-center gap-6">
            <Link href="/profile" className="text-sm font-medium text-slate-400 hover:text-white transition-all font-sans">Profile</Link>
            <span className="text-sm text-slate-300 font-sans hidden sm:block">Hi, {user.displayName?.split(' ')[0] || 'User'}</span>
            <button 
              onClick={() => signOut(auth)}
              className="text-sm font-bold text-slate-500 hover:text-red-400 transition-colors font-sans"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="px-8 py-2.5 bg-saffron/20 border border-saffron/40 text-saffron rounded-full text-sm font-semibold hover:bg-saffron hover:text-white transition-all font-sans active:scale-95 shadow-lg shadow-saffron/10"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
