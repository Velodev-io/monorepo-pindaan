import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const getFirebaseApp = (config: any): FirebaseApp => {
    let app: FirebaseApp;
    try {
        app = !getApps().length ? initializeApp(config) : getApp();
    } catch {
        if (getApps().length) {
            app = getApp();
        } else {
            // Last resort for build time
            app = initializeApp({ ...config, apiKey: "dummy" });
        }
    }
    return app;
};

export const getFirebaseAuth = (app: FirebaseApp) => getAuth(app);
export const getGoogleProvider = () => new GoogleAuthProvider();
