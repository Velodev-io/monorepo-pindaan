import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Purely structural middleware placeholder to prevent logged out
    // users from hitting strictly private dashboard paths natively.
    // Real token verification happens in our <AuthGuard> because it's client-side Firebase.

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
