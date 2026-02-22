import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";

const initializeFirebaseAdmin = () => {
    if (!admin.apps.length) {
        const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

        if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                }),
            });
        } else {
            // Allows verifyIdToken to work without a full service account locally
            admin.initializeApp({ projectId });
        }
    }
};

export const verifyIdToken = async (token: string) => {
    initializeFirebaseAdmin();
    return await getAuth().verifyIdToken(token);
};
