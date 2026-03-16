import { auth } from "./firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : "";

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        console.warn("[apiClient] 401 Unauthorized detected. Signing out and redirecting to login...");
        await auth.signOut();
        if (typeof window !== "undefined") window.location.href = "/login";
        throw new Error("Unauthorized");
    }

    if (response.status === 403) {
        throw new Error("Forbidden: You do not have permission.");
    }

    try {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.error || data?.message || "API request failed");
        }
        return data;
    } catch {
        return response;
    }
}
