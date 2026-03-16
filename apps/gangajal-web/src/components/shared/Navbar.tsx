"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  return (
    <nav className="h-20 border-b border-white/5 px-6 flex items-center justify-between sticky top-0 bg-nav-bg backdrop-blur-md z-50">
      <Link href="/" className="flex items-center gap-3 group">
        <Image 
          src="/images/logo.png" 
          alt="Hridganga Logo" 
          width={180} 
          height={60} 
          className="h-14 w-auto object-contain mix-blend-screen group-hover:scale-105 transition-transform" 
          style={{ width: 'auto' }}
        />
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
