import { Router, Request, Response } from "express";
import { prisma } from "@pinddaan/db";
import { sendEmail } from "@pinddaan/email";
import { authMiddleware, roleGuard } from "@pinddaan/auth";
import { UserRole } from "@pinddaan/types";

const router = Router();

// POST /api/v1/reviews - Submit a new review
router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, email, location, rating, text } = req.body;

        if (!name || !email || !text || !rating) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 1. Save to Database (using any cast as fallback if types aren't generated)
        const review = await (prisma as any).review.create({
            data: {
                name,
                email,
                location,
                rating: Number(rating),
                text,
            },
        });

        // 2. Send email to Admin
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHtml = `
            <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-w: 600px; margin: 0 auto;">
                <h2 style="color: #ca8a04; text-align: center; border-bottom: 2px solid #ca8a04; padding-bottom: 10px;">✨ New Devotee Experience Shared ✨</h2>
                <div style="background-color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 30px;">
                    <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Location:</strong> ${location || "Not provided"}</p>
                    <p style="margin: 0 0 20px 0; color: #ca8a04; font-size: 20px;"><strong>Rating:</strong> ${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</p>
                    <h3 style="margin: 0 0 10px 0; color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Experience:</h3>
                    <p style="margin: 0; font-style: italic; line-height: 1.6; color: #334155; border-left: 3px solid #cbd5e1; padding-left: 15px;">
                        "${text}"
                    </p>
                </div>
                <p style="margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center;">Hridganga Automatically Generated Notification</p>
            </div>
        `;

        if (adminEmail) {
            sendEmail({
                to: adminEmail,
                subject: `✨ New ${rating}-Star Experience from ${name} | Hridganga`,
                html: adminHtml,
            }).catch(err => console.error("[Review Admin Email Error]", err));
        }

        return res.status(201).json({ success: true, data: review });
    } catch (error: any) {
        res.status(500).json({ 
            error: "Failed to process review", 
            details: error.message,
            code: error.code 
        });
    }
});

// GET /api/v1/reviews/public - Get recent public reviews
router.get("/public", async (req: Request, res: Response) => {
    try {
        const reviews = await (prisma as any).review.findMany({
            take: 6,
            orderBy: { createdAt: "desc" },
        });
        
        // Fallback: If no reviews in DB, return empty array (or we could return a subset of mock data if needed)
        res.json({ success: true, data: reviews });
    } catch (error: any) {
        console.error("Public reviews fetch error:", error);
        res.status(500).json({ error: "Failed to fetch public reviews" });
    }
});

// GET /api/v1/reviews - List all reviews (Admin Only)
router.get("/", authMiddleware, roleGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: Request, res: Response) => {
    try {
        const reviews = await (prisma as any).review.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, data: reviews });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/v1/reviews/:id - Delete a review (Admin Only)
router.delete("/:id", authMiddleware, roleGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: Request, res: Response) => {
    try {
        await (prisma as any).review.delete({
            where: { id: req.params.id },
        });
        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
