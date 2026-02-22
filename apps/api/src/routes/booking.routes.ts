import { Router } from "express";
import { authMiddleware, roleGuard } from "@pinddaan/auth";
import { createBooking, getBookings, updateBookingStatus } from "../controllers/booking.controller";

const router = Router();

// Endpoint Protected by Shared Firebase Auth Middleware
router.post(
    "/",
    authMiddleware,
    roleGuard("USER", "ADMIN", "SUPER_ADMIN"),
    createBooking
);

router.get(
    "/",
    authMiddleware,
    getBookings
);

router.patch(
    "/:id/status",
    authMiddleware,
    roleGuard("ADMIN", "SUPER_ADMIN"),
    updateBookingStatus
);

export default router;
