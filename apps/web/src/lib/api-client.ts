import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

const MOCK_DATA: Record<string, any> = {
    '/users/sync': { success: true },
    '/users/me': { success: true, user: { id: 'mock-user-123', name: 'Mock User', email: 'mock@example.com', role: 'USER', phone: '+1 234 567 890', address: '123 Sacred Lane, Varanasi' } },
    '/bookings': {
        success: true, data: [
            {
                id: 'ORD-9821-YX',
                departedName: 'Late Shri Ramesh Sharma',
                gotra: 'Kashyap',
                ritualDate: '2026-02-23',
                status: 'COMPLETED',
                locationId: 'vns-001',
                location: { name: 'Varanasi' },
                service: { name: 'Pind Daan Ritual' }
            }
        ]
    },
    '/locations': {
        success: true, data: [
            { id: 'vns-001', name: 'Varanasi', description: 'Sacred city of lights' },
            { id: 'hwr-001', name: 'Haridwar', description: 'Gateway to gods' }
        ]
    },
    '/locations/multi': {
        success: true,
        data: {
            commonLocations: [
                { id: 'vns-001', name: 'Varanasi', state: 'Uttar Pradesh', image: '' },
                { id: 'hwr-001', name: 'Haridwar', state: 'Uttarakhand', image: '' }
            ],
            serviceLocations: {
                'PIND_DAAN': [{ id: 'vns-001', name: 'Varanasi', state: 'Uttar Pradesh' }],
                'ASTHI_VISARJAN': [{ id: 'vns-001', name: 'Varanasi', state: 'Uttar Pradesh' }, { id: 'hwr-001', name: 'Haridwar', state: 'Uttarakhand' }]
            }
        }
    },
    '/services': {
        success: true, data: [
            { id: 'pind-001', name: 'Pind Daan', price: 150 },
            { id: 'asthi-001', name: 'Asthi Visarjan', price: 120 }
        ]
    }
};

export async function apiClient(endpoint: string, options: RequestInit = {}) {
    if (USE_MOCK) {
        const baseEndpoint = endpoint.split('?')[0];
        console.log(`[MOCK API] ${options.method || 'GET'} ${endpoint}`);
        return MOCK_DATA[baseEndpoint] || { success: true, data: [] };
    }

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
