import { sendEmail } from "../../packages/email";
import * as dotenv from "dotenv";
import * as path from "path";

// Load env from apps/api/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function runTest() {
    console.log("--- Starting Direct Email Test ---");
    console.log("User:", process.env.EMAIL_USER);
    console.log("Admin Email:", process.env.ADMIN_EMAIL);
    
    try {
        await sendEmail({
            to: process.env.ADMIN_EMAIL || (process.env.EMAIL_USER as string),
            subject: "Hridganga Final Connectivity Test 🪔",
            html: "<h1>Connection Confirmed</h1><p>The nodemailer service is now fully configured with your credentials.</p>"
        });
        console.log("✅ Test script completed successfully!");
    } catch (error) {
        console.error("❌ Test script failed:", error);
    }
}

runTest();
