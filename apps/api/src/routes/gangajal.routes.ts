import { Router } from "express";
import { verifyFirebaseTokenMiddleware } from "@pinddaan/auth";
import * as gangajalController from "../controllers/gangajal.controller";

const router = Router();

// All gangajal order routes are protected by Firebase Auth
router.use(verifyFirebaseTokenMiddleware);

router.post("/orders", gangajalController.createOrder);
router.get("/orders", gangajalController.listOrders);

export default router;
