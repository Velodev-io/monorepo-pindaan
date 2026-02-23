import { NextResponse } from 'next/server';
import { ZodError, ZodIssue } from 'zod';
import { logger } from '@/lib/logger';

export class ApiError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export function handleApiError(error: unknown) {
    logger.error(error); // Using Pino for structured logging

    if (error instanceof ZodError) {
        return NextResponse.json({
            success: false,
            message: "Validation Error",
            errors: error.issues.map((e: ZodIssue) => ({ path: e.path.join('.'), message: e.message }))
        }, { status: 400 });
    }

    if (error instanceof ApiError) {
        return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
    }

    return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
    );
}
