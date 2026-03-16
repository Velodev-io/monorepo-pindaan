"use client"

import { useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl p-12 rounded-[40px] border border-white/5 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-saffron shadow-[0_0_20px_rgba(251,146,60,0.5)]" />
        <h2 className="text-4xl font-bold text-white mb-4 font-playfair tracking-tight">Welcome Back</h2>
        <p className="text-slate-400 mb-10 font-medium font-inter">Sign in to manage your sacred orders</p>
        
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 border-2 border-white/5 rounded-2xl font-bold text-slate-300 hover:bg-white/5 hover:border-saffron/40 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 group"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="mt-8 text-xs text-slate-500 font-medium tracking-wide">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
