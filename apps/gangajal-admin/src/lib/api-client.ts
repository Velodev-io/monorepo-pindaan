import { auth } from "./firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_ADMIN_DATA === "true";

// Mock responses for local development when no backend is running.
// Toggle via NEXT_PUBLIC_USE_MOCK_ADMIN_DATA=true in .env
const MOCK_RESPONSES: Record<string, unknown> = {
    "/users/sync": { success: true },
    "/users/me/role": { role: "ADMIN" },
};

export async function apiClient(endpoint: string, options: RequestInit = {}) {
    if (USE_MOCK) {
        return MOCK_RESPONSES[endpoint] ?? { success: true, data: [] };
    }

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
