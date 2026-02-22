"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("@pinddaan/config");
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
}));
// Enable CORS for all local development ports
app.use((0, cors_1.default)({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(express_1.default.json());
// Root Route & Healthcheck
app.get("/", (req, res) => res.send("Pinddaan API Server is running successfully."));
// Rate Limiting (100 reqs per 10 mins)
app.use((0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP",
}));
// Healthcheck
app.get("/health", (req, res) => res.json({ status: "OK" }));
// Routes Layer
app.use("/api/v1/bookings", booking_routes_1.default);
// Central Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === "ZodError") {
        return res.status(400).json({ error: "Validation Error", details: err.errors });
    }
    return res.status(500).json({ error: "Internal Server Error" });
});
const PORT = config_1.ENV.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 API Server running securely on port ${PORT}`);
});
