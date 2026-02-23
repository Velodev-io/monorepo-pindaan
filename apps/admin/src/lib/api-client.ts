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
        // Clear auth and force re-login if token is invalid or expired via Backend
        if (typeof window !== 'undefined') {
            await auth.signOut();
            window.location.href = '/login';
        }
        throw new Error('Unauthorized');
    }

    if (response.status === 403) {
        // Not an admin
        throw new Error('Forbidden: You do not have permission to perform this action.');
    }

    let data;
    try {
        data = await response.json();
    } catch {
        // If not JSON, return as is
        return response;
    }

    if (!response.ok) {
        throw new Error(data?.error || data?.message || 'API request failed');
    }

    return data;
}
