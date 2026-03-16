import { Router, Request, Response } from "express";
import { authMiddleware, roleGuard } from "@pinddaan/auth";
import { OrderStatus, PaymentStatus, UserRole } from "@pinddaan/types";
import { prisma } from "@pinddaan/db";
import { sendEmail, buildCustomerOrderEmail, buildAdminNotificationEmail } from "@pinddaan/email";

const router = Router();

// POST /api/v1/orders - Create a new order (Public for Checkout)
router.post("/", async (req: Request, res: Response) => {
    try {
        const { customerName, customerEmail, items, amount, shippingAddress, userId } = req.body;

        if (!customerName || !customerEmail || !items || !amount || !shippingAddress) {
            return res.status(400).json({ error: "Missing required order fields" });
        }

        // 1. Create order in DB
        const order = await prisma.order.create({
            data: {
                userId: userId || null,
                customerName,
                customerEmail,
                amount,
                shippingAddress,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        name: item.name || item.title,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: { items: true }
        });

        // 2. Prepare email data
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const emailData = {
            customerName,
            customerEmail,
            orderId: order.id,
            items: items.map((item: any) => ({
                name: item.title || item.name,
                volume: item.label,
                quantity: item.quantity,
                price: item.price
            })),
            subtotal,
            shipping: 5.01, // Mocked shipping for now
            total: amount,
            shippingAddress
        };

        // 3. Send Emails asynchronously (don't await so checkout responds faster)
        Promise.all([
            sendEmail({
                to: customerEmail,
                subject: `🪔 Your Hridganga Order is Confirmed – #${order.id}`,
                html: buildCustomerOrderEmail(emailData),
            }),
            process.env.ADMIN_EMAIL ? sendEmail({
                to: process.env.ADMIN_EMAIL,
                subject: `📦 New Gangajal Order Received – #${order.id} ($${amount.toFixed(2)})`,
                html: buildAdminNotificationEmail(emailData),
            }) : Promise.resolve()
        ]).catch(err => console.error("[Order Email Error]", err));

        res.status(201).json({ success: true, data: order });
    } catch (error: any) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to process order" });
    }
});

// GET /api/v1/orders/recent - (Admin Only)
router.get("/recent", authMiddleware, roleGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 5;
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { items: true }
        });
        res.json({ success: true, data: orders });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/v1/orders - List all (Admin Only)
router.get("/", authMiddleware, roleGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const status = req.query.status as string | undefined;

        const whereClause = status && status !== "ALL" ? { status } : {};

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: { items: true }
            }),
            prisma.order.count({ where: whereClause })
        ]);

        res.json({ data: orders, total });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/v1/orders/:id - Get single order (Admin Only)
router.get("/:id", authMiddleware, roleGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: Request, res: Response) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: { items: true }
        });
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/v1/orders/:id - Update order (Admin Only)
router.patch("/:id", authMiddleware, roleGuard(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: Request, res: Response) => {
    try {
        const { status, trackingNumber, carrier, adminNotes } = req.body;
        
        const updateData: any = {};
        if (status) updateData.status = status;
        if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
        if (carrier !== undefined) updateData.carrier = carrier;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: updateData,
            include: { items: true }
        });

        res.json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
