import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";

const initializeFirebaseAdmin = () => {
    if (!admin.apps.length) {
        console.log("[FirebaseAdmin] Initializing with Project ID:", process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
        const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

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
            // Allows verifyIdToken to work without a full service account locally
            admin.initializeApp({ projectId });
        }
    }
};

export const verifyIdToken = async (token: string) => {
    initializeFirebaseAdmin();
    return await getAuth().verifyIdToken(token);
};
