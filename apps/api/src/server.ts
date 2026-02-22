import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ENV } from "@pinddaan/config";
import bookingRoutes from "./routes/booking.routes";
import userRoutes from "./routes/user.routes";

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

// Routes Layer
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);

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

app.listen(PORT, () => {
    console.log(`🚀 API Server running securely on port ${PORT}`);
});
