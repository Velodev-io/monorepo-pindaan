import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";

const decodeProjectIdFromToken = (token: string): string | undefined => {
    try {
        const [, payloadPart] = token.split(".");
        if (!payloadPart) return undefined;

        const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
        const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as {
            aud?: string;
            iss?: string;
        };

        if (payload.aud && typeof payload.aud === "string") {
            return payload.aud;
        }

        if (payload.iss && typeof payload.iss === "string") {
            const prefix = "https://securetoken.google.com/";
            if (payload.iss.startsWith(prefix)) {
                return payload.iss.slice(prefix.length);
            }
        }
    } catch {
        // Intentionally ignore decode errors and continue with env-based fallback.
    }

    return undefined;
};

const initializeFirebaseAdmin = (token?: string) => {
    if (!admin.apps.length) {
        const projectId =
            process.env.FIREBASE_PROJECT_ID ||
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
            (token ? decodeProjectIdFromToken(token) : undefined);
        console.log("[FirebaseAdmin] Initializing with Project ID:", projectId);

        if (!projectId) {
            throw new Error(
                "Missing Firebase project ID. Set FIREBASE_PROJECT_ID or provide a valid Firebase ID token."
            );
        }

        if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
            console.log("[FirebaseAdmin] Using Service Account (Client Email):", process.env.FIREBASE_CLIENT_EMAIL);
            let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";
            // Clean up any extra quote marks and replace literal \n with actual newlines
            privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
            
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
            });
        } else {
            console.warn("[FirebaseAdmin] No service account found. Falling back to default project initialization.");
            // Works locally without a service account when projectId is known.
            admin.initializeApp({ projectId });
        }
    }
};

export const verifyIdToken = async (token: string) => {
    initializeFirebaseAdmin(token);
    return await getAuth().verifyIdToken(token);
};
