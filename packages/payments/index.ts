import { PaymentStatus } from "@pinddaan/types";

export interface CheckoutSessionOptions {
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
    successUrl: string;
    cancelUrl: string;
}

export interface CheckoutSession {
    id: string;
    url: string;
}

export interface PaymentProvider {
    createCheckoutSession(options: CheckoutSessionOptions): Promise<CheckoutSession>;
    verifyWebhook(payload: any, signature: string): Promise<{ orderId: string; status: PaymentStatus }>;
}

export class MockPaymentProvider implements PaymentProvider {
    async createCheckoutSession(options: CheckoutSessionOptions): Promise<CheckoutSession> {
        console.log("[MOCK PAYMENT] Creating checkout session", options);
        return {
            id: `mock_session_${Date.now()}`,
            url: `${options.successUrl}?session_id=mock_session_${Date.now()}`,
        };
    }

    async verifyWebhook(payload: any, signature: string): Promise<{ orderId: string; status: PaymentStatus }> {
        console.log("[MOCK PAYMENT] Verifying webhook", { payload, signature });
        return {
            orderId: payload.orderId || "mock_order_123",
            status: PaymentStatus.SUCCESS,
        };
    }
}

export const paymentProvider = new MockPaymentProvider();
