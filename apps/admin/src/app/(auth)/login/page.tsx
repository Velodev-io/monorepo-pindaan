"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
            // This prevents an immediate AuthGuard 401 if they were added via Firebase Console instead of Web Registration!
                        await apiClient("/users/sync", {
                method: "POST",
                body: JSON.stringify({}),
            });

            // The AuthGuard will handle strict role verification upon redirect
            router.push("/");
        } catch (err: unknown) {
            console.error("Login failed:", err);
            setError("Invalid credentials or unauthorized.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <LogIn className="h-6 w-6 text-zinc-950" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-zinc-100 mb-2">Admin Portal</h1>
                <p className="text-zinc-500 text-center mb-8">Secure login for Pinddaan Staff</p>

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
                            className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                            placeholder="admin@pinddaan.store"
                        />
                    </div>
                    <div>
                        <label className="text-zinc-400 text-sm font-medium block mb-1">Passphrase</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                            placeholder="••••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Decrypting..." : "Authenticate"}
                        {!loading && <LogIn className="h-4 w-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
