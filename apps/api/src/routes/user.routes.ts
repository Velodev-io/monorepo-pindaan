import { Router, Request, Response } from "express";
import { prisma } from "@pinddaan/db";
import { authMiddleware, verifyFirebaseTokenMiddleware } from "@pinddaan/auth";

const router = Router();

// Retrieve User Role for Admin Portal AuthGuard
router.get("/me/role", authMiddleware, async (req: Request, res: Response): Promise<any> => {
    try {
        const user = (req as any).user;
        if (!user) {
            return res.status(404).json({ error: "User not found in DB" });
        }
        return res.json({ role: user.role });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

// Sync Firebase Auth with Prisma PostgreSQL
router.post("/sync", verifyFirebaseTokenMiddleware, async (req: Request, res: Response): Promise<any> => {
    try {
        const decoded = (req as any).firebaseUser;
        const body = req.body || {};

        // Find existing user or check if this is the absolute FIRST user in the system
        let user = await prisma.user.findUnique({ where: { id: decoded.uid } });
        const userCount = await prisma.user.count();

        if (!user) {
            // First user gets SUPER_ADMIN automatically!
            const role = userCount === 0 ? "SUPER_ADMIN" : "USER";

            user = await prisma.user.create({
                data: {
                    id: decoded.uid,
                    email: decoded.email || body.email || "no-email@pinddaan.store",
                    name: decoded.name || body.name || "Pinddaan User",
                    role: role,
                }
            });
        }

        return res.json({ success: true, user });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

// GET all users (Admin Only)
router.get("/", authMiddleware, async (req: Request, res: Response): Promise<any> => {
    try {
        const user = (req as any).user;
        if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") return res.status(403).json({ error: "Forbidden" });

        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;

        const [users, total] = await Promise.all([
            prisma.user.findMany({ take: limit, skip: (page - 1) * limit, orderBy: { createdAt: "desc" } }),
            prisma.user.count()
        ]);

        return res.json({ success: true, data: users, total });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

// Update Role (Super Admin Only)
router.patch("/:id/role", authMiddleware, async (req: Request, res: Response): Promise<any> => {
    try {
        const currentUser = (req as any).user;
        if (currentUser.role !== "SUPER_ADMIN") return res.status(403).json({ error: "Only Super Admins can assign roles" });

        const { id } = req.params;
        const { role } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { role }
        });

        return res.json({ success: true, user });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

// Disable User (Admin Only)
router.patch("/:id/disable", authMiddleware, async (req: Request, res: Response): Promise<any> => {
    try {
        const currentUser = (req as any).user;
        if (currentUser.role !== "ADMIN" && currentUser.role !== "SUPER_ADMIN") return res.status(403).json({ error: "Forbidden" });

        const { id } = req.params;

        // Toggle Active
        const targetUser = await prisma.user.findUnique({ where: { id } });
        if (!targetUser) return res.status(404).json({ error: "User not found" });

        const user = await prisma.user.update({
            where: { id },
            data: { isActive: !targetUser.isActive }
        });

        return res.json({ success: true, user });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

import mcache from "memory-cache";

// Simple in-memory cache middleware for extremely dynamic dashboard stats
const cacheMiddleware = (duration: number) => {
    return (req: Request, res: Response, next: any) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = mcache.get(key);
        if (cachedBody) {
            res.send(cachedBody);
            return;
        } else {
            const originalSend = res.send;
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                return originalSend.call(res, body);
            };
            next();
        }
    }
};

// Dashboard Stats (Admin Only) - Cached for 10 seconds to eliminate simultaneous query thrashing
router.get("/stats/dashboard", authMiddleware, cacheMiddleware(10), async (req: Request, res: Response): Promise<any> => {
    try {
        const currentUser = (req as any).user;
        if (currentUser.role !== "ADMIN" && currentUser.role !== "SUPER_ADMIN") return res.status(403).json({ error: "Forbidden" });

        const [usersCount, bookingsCount, pendingCount, recentBookings, totalRevenue] = await Promise.all([
            prisma.user.count(),
            prisma.booking.count(),
            prisma.booking.count({ where: { status: "PENDING" } }),
            prisma.booking.findMany({
                take: 4,
                orderBy: { createdAt: "desc" },
                include: { user: true, service: true, location: true }
            }),
            prisma.booking.findMany({
                include: { service: true }
            })
        ]);

        const revenue = totalRevenue.reduce((acc, curr) => acc + (curr.service?.basePrice || 0), 0);

        const responsePayload = {
            success: true,
            stats: { users: usersCount, bookings: bookingsCount, pending: pendingCount, revenue },
            recentBookings
        };

        // Res.json calls res.send under the hood which will trigger the cache write!
        return res.json(responsePayload);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
