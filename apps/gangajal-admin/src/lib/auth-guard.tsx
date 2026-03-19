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
                // Verify admin access against backend role.
                const roleResponse = await apiClient("/users/me/role");
                const role = typeof roleResponse?.role === "string" ? roleResponse.role.toUpperCase() : "";

                if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
                    console.warn(`[AuthGuard] Insufficient role: ${role || "UNKNOWN"}. Access denied.`);
                    await auth.signOut();
                    router.push(`/login?error=forbidden${role ? `&role=${encodeURIComponent(role)}` : ""}`);
                    return;
                }

                setIsAuthorized(true);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Authorization check failed";
                // Treat auth/permission failures as expected redirect paths in dev.
                if (message.includes("Unauthorized") || message.includes("Forbidden")) {
                    console.warn("[AuthGuard] Authorization check failed:", message);
                } else {
                    console.error("[AuthGuard] Authorization check failed:", message);
                }
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
