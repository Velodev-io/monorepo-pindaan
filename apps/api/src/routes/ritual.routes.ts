import { Router } from "express";
import { authMiddleware, roleGuard } from "@pinddaan/auth";
import { getServices, createService, updateService, deleteService } from "../controllers/ritual.controller";

const router = Router();

router.get("/", getServices);

router.post(
    "/",
    authMiddleware,
    roleGuard("ADMIN", "SUPER_ADMIN"),
    createService
);

router.patch(
    "/:id",
    authMiddleware,
    roleGuard("ADMIN", "SUPER_ADMIN"),
    updateService
);

router.delete(
    "/:id",
    authMiddleware,
    roleGuard("ADMIN", "SUPER_ADMIN"),
    deleteService
);

export default router;
