import { Router, Request, Response } from "express";
import { authMiddleware, roleGuard } from "@pinddaan/auth";
import { UserRole } from "@pinddaan/types";
import { prisma } from "@pinddaan/db";

const router = Router();

// GET /api/v1/products - Public route to fetch all active products
router.get("/", async (req: Request, res: Response) => {
    try {
        const isActiveOnly = req.query.isActive === "true";
        const products = await prisma.product.findMany({
            where: isActiveOnly ? { isActive: true } : undefined,
            orderBy: { volumeMl: 'asc' }
        });
        res.json({ success: true, data: products });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/v1/products/:id - Public route to fetch a single product
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });
        if (!product) return res.status(404).json({ success: false, error: "Product not found" });
        res.json({ success: true, data: product });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/v1/products - Create a new product (Admin Only)
router.post("/", authMiddleware, roleGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.create({
            data: req.body
        });
        res.status(201).json({ success: true, data: product });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT /api/v1/products/:id - Update an existing product (Admin Only)
router.put("/:id", authMiddleware, roleGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json({ success: true, data: product });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE /api/v1/products/:id - Delete a product (Admin Only)
router.delete("/:id", authMiddleware, roleGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: Request, res: Response) => {
    try {
        await prisma.product.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true, message: "Product deleted" });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
});

export default router;
