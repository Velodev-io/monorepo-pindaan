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
            if (!user) {
                if (!pathname.includes("/login")) {
                    router.push("/login");
                }
                setIsLoading(false);
                return;
            }

            try {
                // Verify Admin Role via our Express API Endpoint 
                // which returns true if their DB role is ADMIN or SUPER_ADMIN
                const { role } = await apiClient("/users/me/role");
                
                if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
                    throw new Error("UNAUTHORIZED_ROLE");
                }
                setIsAuthorized(true);
            } catch {
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
