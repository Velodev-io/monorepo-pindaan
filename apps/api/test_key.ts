import { ENV } from "@pinddaan/config";
import * as admin from "firebase-admin";

const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/^"|"$/g, '').replace(/\\n/g, '\n');

console.log("----- RAW ENV -----");
console.log(process.env.FIREBASE_PRIVATE_KEY);
console.log("----- CLEANED -----");
console.log(privateKey);
console.log("----- PEM CHECK -----");
if (!privateKey.includes("BEGIN PRIVATE KEY") || !privateKey.includes("END PRIVATE KEY")) {
    console.log("MISSING BEGIN/END TAGS");
} else {
    console.log("TAGS PRESENT");
}
