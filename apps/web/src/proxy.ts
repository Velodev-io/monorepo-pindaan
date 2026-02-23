import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];

    // Paths requiring Admin
    if (request.nextUrl.pathname.startsWith('/api/admin') || request.nextUrl.pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
            if (payload.role !== 'ADMIN') {
                return NextResponse.json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 });
            }
        } catch (e) {
            return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 });
        }
    }

    // Allow through
    return NextResponse.next();
}

export const config = {
    matcher: ['/api/admin/:path*', '/admin/:path*'],
};
