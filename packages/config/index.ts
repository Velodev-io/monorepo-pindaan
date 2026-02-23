import { z } from "zod";
// Basic environment detection
const isNode = typeof process !== "undefined" && process?.versions?.node;

if (isNode) {
    try {
        const dotenv = require("dotenv");
        const path = require("path");

        // Search for .env in current dir, then parent, then root
        const envPaths = [
            path.resolve(process.cwd(), '.env'),
            path.resolve(process.cwd(), '../../.env'),
            path.resolve(process.cwd(), '../../../.env')
        ];

        for (const envPath of envPaths) {
            dotenv.config({ path: envPath });
        }
    } catch (e) {
        // Silently skip if modules or files are missing (e.g. build time)
    }
}

// Basic schema with optional fields for flexibility
export const envSchema = z.object({
    DATABASE_URL: z.string().url().optional(), // Make optional for build-time safety
    PORT: z.string().default("3001"),
    FIREBASE_PROJECT_ID: z.string().optional(),
    FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
    FIREBASE_PRIVATE_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    AWS_REGION: z.string().optional(),
    EMAIL_HOST: z.string().optional(),
    EMAIL_PORT: z.string().optional().default("587"),
    EMAIL_USER: z.string().optional(),
    EMAIL_PASS: z.string().optional(),
    ADMIN_EMAIL: z.string().optional().default("admin@pinddaan.store")
});

export const validateEnv = () => {
    // Only parse if we have a process.env (Node environment)
    if (typeof process === 'undefined' || !process.env) {
        return {} as any;
    }

    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        // Only warn during development/production, don't crash build
        console.warn("⚠️ Environment validation warning:", parsed.error.format());
        return process.env as any;
    }
    return parsed.data;
};

// Lazy export to avoid immediate execution
export const getEnv = () => validateEnv();
export const ENV = typeof process !== 'undefined' ? validateEnv() : {} as any;
