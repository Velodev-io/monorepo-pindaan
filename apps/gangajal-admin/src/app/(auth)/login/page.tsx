"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            
            // Explicitly sync the user into the Neon DB 
            await apiClient("/users/sync", {
                method: "POST",
                body: JSON.stringify({
                    name: userCredential.user.displayName,
                    email: userCredential.user.email,
                }),
            });
            console.log("API sync successful, redirecting to home.");

            router.push("/");
        } catch (err: any) {
            console.error("Login process failed:", err.code || "API_ERROR", err.message);
            if (err.code === "auth/invalid-credential") {
                setError("Incorrect email or password. Please check your credentials.");
            } else if (err.code === "auth/user-not-found") {
                setError("No account found with this email.");
            } else if (err.code === "auth/too-many-requests") {
                setError("Too many failed attempts. Please try again later.");
            } else {
                setError(err.message || "An unexpected error occurred during authentication.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            
            // Explicitly sync the user into the Neon DB 
            await apiClient("/users/sync", {
                method: "POST",
                body: JSON.stringify({
                    name: userCredential.user.displayName,
                    email: userCredential.user.email,
                }),
            });
            console.log("Sync successful, redirecting...");

            // The AuthGuard will handle strict role verification upon redirect
            router.push("/");
        } catch (err: unknown) {
            console.error("Google login failed detail:", err);
            setError(`Google sign-in failed: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 bg-[#FF9933] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF9933]/20 text-white font-bold text-xl">
                        G
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-zinc-100 mb-2">Gangajal Admin</h1>
                <p className="text-zinc-500 text-center mb-8">Secure login for Gangajal.store Staff</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-zinc-400 text-sm font-medium block mb-1">Vault Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-zinc-100 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-colors"
                            placeholder="admin@gangajal.store"
                        />
                    </div>
                    <div>
                        <label className="text-zinc-400 text-sm font-medium block mb-1">Passphrase</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-zinc-100 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-colors"
                            placeholder="••••••••••"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#FF9933] hover:bg-[#FF9933]/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Decrypting..." : "Authenticate"}
                            {!loading && <LogIn className="h-4 w-4" />}
                        </button>
                        
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-zinc-800"></div>
                            <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs">OR</span>
                            <div className="flex-grow border-t border-zinc-800"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Sign in with Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
