"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { apiClient } from "./api-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log(`[AuthGuard] Auth state changed. User: ${user?.email || 'none'}`);
            if (!user) {
                if (!pathname.includes("/login")) {
                    console.log("[AuthGuard] No user found, redirecting to /login");
                    router.push("/login");
                }
                setIsLoading(false);
                return;
            }

            try {
                console.log("[AuthGuard] Verifying role for:", user.email);
                // Verify Admin Role via our Express API Endpoint 
                // which returns true if their DB role is ADMIN or SUPER_ADMIN
                const { role } = await apiClient("/users/me/role");
                console.log(`[AuthGuard] Role verified: ${role}`);
                
                if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
                    console.warn(`[AuthGuard] Insufficient role: ${role}. Access denied.`);
                    throw new Error("UNAUTHORIZED_ROLE");
                }
                setIsAuthorized(true);
            } catch (err: any) {
                console.error("[AuthGuard] Authorization check failed:", err.message);
                auth.signOut();
                router.push("/login?error=forbidden");
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router, pathname]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center font-semibold animate-pulse text-slate-800">Verifying Admin Access...</div>;
    }

    if (!isAuthorized) {
        return null; // Will redirect in useEffect
    }

    return children;
}
