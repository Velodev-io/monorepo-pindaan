import { Router } from "express";
import {
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
    deleteLocation,
} from "../controllers/location.controller";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
// Note: The public search endpoint is handled separately or can be added here
// For now, let's keep it clean.

// Admin only routes
router.post("/", authenticate, isAdmin, createLocation);
router.get("/", authenticate, isAdmin, getAllLocations);
router.get("/:id", authenticate, isAdmin, getLocationById);
router.put("/:id", authenticate, isAdmin, updateLocation);
router.delete("/:id", authenticate, isAdmin, deleteLocation);

export default router;
