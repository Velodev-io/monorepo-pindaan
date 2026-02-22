"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("@pinddaan/auth");
const booking_controller_1 = require("../controllers/booking.controller");
const router = (0, express_1.Router)();
// Endpoint Protected by Shared Firebase Auth Middleware
router.post("/", auth_1.authMiddleware, (0, auth_1.roleGuard)("USER", "ADMIN"), booking_controller_1.createBooking);
router.get("/", auth_1.authMiddleware, booking_controller_1.getBookings);
exports.default = router;
