const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../../.env" });

async function testEmail() {
    console.log("Testing email with config:");
    console.log("Host:", process.env.EMAIL_HOST);
    console.log("User:", process.env.EMAIL_USER);
    console.log("Pass length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log("✅ Connection is successful!");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: "Pinddaan Test Email",
            text: "This is a test email to verify the SMTP configuration.",
        });

        console.log("✅ Message sent: %s", info.messageId);
    } catch (error) {
        console.error("❌ Email failed:", error);
    }
}

testEmail();
