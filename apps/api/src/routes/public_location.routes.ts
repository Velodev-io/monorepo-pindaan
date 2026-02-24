import { Router } from "express";
import { getPublicLocations, getMultiServiceLocations } from "../controllers/location.controller";

const router = Router();

router.get("/", getPublicLocations);
router.get("/multi", getMultiServiceLocations);

export default router;
