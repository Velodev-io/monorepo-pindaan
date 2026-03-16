"use client"
import { useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSocialLogin = async (provider: any) => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push("/");
    } catch (error: any) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-12">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl p-10 rounded-[40px] border border-white/5 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-saffron shadow-[0_0_20px_rgba(251,146,60,0.5)]" />
        
        <div className="flex justify-center mb-8">
          <Image 
            src="/images/logo.png" 
            alt="Hridganga Logo" 
            width={120} 
            height={120} 
            className="h-28 w-auto object-contain mix-blend-screen" 
            style={{ width: 'auto' }}
          />
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-2 font-playfair tracking-tight">Join Hridganga</h2>
        <p className="text-slate-400 mb-8 font-medium font-inter">Create an account to track your sacred journey</p>

        <form onSubmit={handleRegister} className="space-y-4 mb-6">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-saffron transition-colors" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-saffron/50 focus:ring-1 focus:ring-saffron/20 transition-all font-inter"
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-saffron transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-saffron/50 focus:ring-1 focus:ring-saffron/20 transition-all font-inter"
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-saffron transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-saffron/50 focus:ring-1 focus:ring-saffron/20 transition-all font-inter"
            />
          </div>

          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-saffron text-slate-950 rounded-2xl font-bold hover:bg-saffron/90 hover:shadow-[0_0_20px_rgba(251,146,60,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="relative flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-xs text-slate-500 font-bold tracking-widest uppercase">Or Sign Up With</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        
        <div className="mb-8">
          <button
            onClick={() => handleSocialLogin(googleProvider)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 border border-white/10 rounded-2xl font-bold text-slate-300 hover:bg-white/5 hover:border-saffron/40 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 group"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
            Continue with Google
          </button>
        </div>

        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-saffron hover:text-saffron/80 font-bold transition-all underline underline-offset-4 decoration-saffron/20">
            Sign In
          </Link>
        </p>

        <p className="mt-8 text-[10px] text-slate-500 font-medium tracking-wide leading-relaxed">
          By joining, you agree to our <br />
          <span className="text-slate-400 hover:text-saffron cursor-pointer underline underline-offset-4 decoration-white/10 transition-colors">Terms of Service</span> and <span className="text-slate-400 hover:text-saffron cursor-pointer underline underline-offset-4 decoration-white/10 transition-colors">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
