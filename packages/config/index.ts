import { z } from "zod";
import * as dotenv from "dotenv";
import path from "path";

// Search for .env in current dir, then parent, then root
const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../../.env'),
    path.resolve(__dirname, '../../../.env')
];

for (const envPath of envPaths) {
    dotenv.config({ path: envPath });
}

export const envSchema = z.object({
    DATABASE_URL: z.string().url(),
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
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error("❌ Invalid environment variables:", parsed.error.format());
        throw new Error("Invalid environment variables");
    }
    return parsed.data;
};

export const ENV = validateEnv();
