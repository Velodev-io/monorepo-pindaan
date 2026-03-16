import { NextRequest, NextResponse } from "next/server";
import {
    sendEmail,
    buildCustomerOrderEmail,
    buildAdminNotificationEmail,
    OrderEmailData,
} from "@pinddaan/email";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data: OrderEmailData = body;

        if (!data.customerEmail || !data.orderId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1) Send confirmation email to the customer
        await sendEmail({
            to: data.customerEmail,
            subject: `🪔 Your Hridganga Order is Confirmed – #${data.orderId}`,
            html: buildCustomerOrderEmail(data),
        });

        // 2) Notify admin about the new order
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
            await sendEmail({
                to: adminEmail,
                subject: `📦 New Hridganga Order Received – #${data.orderId} ($${data.total.toFixed(2)})`,
                html: buildAdminNotificationEmail(data),
            });
        }

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        console.error("[send-order-emails] Error:", err);
        return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
    }
}
