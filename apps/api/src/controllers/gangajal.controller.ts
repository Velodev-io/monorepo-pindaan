import { Response, NextFunction } from "express";
import { shippingAddressSchema } from "@pinddaan/schemas";
import { OrderStatus, PaymentStatus } from "@pinddaan/types";
import { emailService } from "@pinddaan/email";

// Mock database for orders storage in memory for localhost testing
const mockOrders: any[] = [];

export const createOrder = async (req: any, res: Response, next: NextFunction) => {
    try {
        const validatedData = shippingAddressSchema.parse(req.body);

        const newOrder = {
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
            userId: req.firebaseUser.uid,
            items: [
                {
                    id: "item-1",
                    productId: "gangajal-500ml",
                    name: "Gangajal (500ml)",
                    quantity: 1,
                    price: 19.99
                }
            ],
            amount: 25.00,
            currency: "USD",
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            shippingAddress: validatedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockOrders.push(newOrder);

        // Mock email sending
        await emailService.sendEmail({
            to: (req.firebaseUser && req.firebaseUser.email) || "user@example.com",
            subject: "Order Placed - Gangajal.store",
            template: "orderPlaced",
            data: { orderId: newOrder.id, amount: newOrder.amount }
        });

        res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
};

export const listOrders = async (req: any, res: Response) => {
    const userId = req.firebaseUser?.uid;
    const userOrders = mockOrders.filter(o => o.userId === userId);
    res.json(userOrders);
};
