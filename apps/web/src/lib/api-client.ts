import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function apiClient(endpoint: string, options: RequestInit = {}) {
    const user = auth.currentUser;
    let token = '';

    if (user) {
        token = await user.getIdToken();
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Optional: handle session expiry if needed in web app
        console.warn('Unauthorized request');
    }

    let data;
    try {
        data = await response.json();
    } catch {
        return response;
    }

    if (!response.ok) {
        throw new Error(data?.error || data?.message || 'API request failed');
    }

    return data;
}
