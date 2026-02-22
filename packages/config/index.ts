import { z } from "zod";
import * as dotenv from "dotenv";
import path from "path";

// Load .env from workspace root regardless of which app runs this
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    PORT: z.string().default("3001"),
    FIREBASE_PROJECT_ID: z.string().optional(),
    FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
    FIREBASE_PRIVATE_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    AWS_REGION: z.string().optional()
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
