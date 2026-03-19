import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ENV } from "@pinddaan/config";
import bookingRoutes from "./routes/booking.routes";
import userRoutes from "./routes/user.routes";
import ritualRoutes from "./routes/ritual.routes";
import locationRoutes from "./routes/location.routes";
import publicLocationRoutes from "./routes/public_location.routes";
import gangajalRoutes from "./routes/gangajal.routes";
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import reviewRoutes from "./routes/review.routes";
import { sendEmail } from "@pinddaan/email";

const app = express();

// Security Middlewares
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
    })
);
// Enable CORS for all local development ports safely
app.use(cors({ origin: "*", methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());

// Root Route & Healthcheck
app.get("/", (req, res) => res.send("Pinddaan API Server is running successfully."));

// Rate Limiting (100 reqs per 10 mins)
app.use(
    rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 100,
        message: "Too many requests from this IP",
    })
);

// Healthcheck
app.get("/health", (req, res) => res.json({ status: "OK" }));

// Diagnostic Email Test
app.get("/api/v1/test-email", async (req, res) => {
    try {
        await sendEmail({
            to: process.env.ADMIN_EMAIL || (process.env.EMAIL_USER as string),
            subject: "Hridganga Connection Test 🪔",
            html: `<h1>SMTP Test Successful</h1><p>Time: ${new Date().toISOString()}</p><p>Sent to: ${process.env.ADMIN_EMAIL}</p>`
        });
        res.json({ success: true, message: "Test email sent successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Routes Layer
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/services", ritualRoutes);
app.use("/api/v1/admin/locations", locationRoutes);
app.use("/api/v1/locations", publicLocationRoutes);
app.use("/api/v1/gangajal", gangajalRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// Central Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    if (err.name === "ZodError") {
        console.error("Validation Error Details:", JSON.stringify(err.errors, null, 2));
        return res.status(400).json({
            error: "Validation Error",
            message: err.errors[0]?.message,
            details: err.errors
        });
    }
    return res.status(500).json({ error: "Internal Server Error" });
});

const PORT = ENV.PORT || 3001;

// Only listen if this file is run directly (not via vercel)
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🚀 API Server running securely on port ${PORT}`);
        console.log(`📧 Email Service Config: HOST=${process.env.EMAIL_HOST}, USER=${process.env.EMAIL_USER}, PASS_SET=${!!process.env.EMAIL_PASS}, ADMIN=${process.env.ADMIN_EMAIL}`);
    });
}

export default app;
