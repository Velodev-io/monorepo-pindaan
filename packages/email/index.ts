import nodemailer from "nodemailer";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderEmailData {
    customerName: string;
    customerEmail: string;
    orderId: string;
    items: Array<{
        name: string;
        volume: string;
        quantity: number;
        price: number;
    }>;
    subtotal: number;
    shipping: number;
    total: number;
    shippingAddress: {
        name: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}

export interface SendEmailOptions {
    to: string;
    subject: string;
    html?: string;
    template?: string;
    data?: any;
}

// ─── Exported Service ────────────────────────────────────────────────────────

export const emailService = {
  sendEmail: async (options: SendEmailOptions) => {
    return sendEmail(options);
  }
};

// ─── Transporter ─────────────────────────────────────────────────────────────

function createTransporter() {
    const isGmail = (process.env.EMAIL_HOST || "smtp.gmail.com").includes("gmail");
    
    console.log("[EMAIL] Creating transporter for:", isGmail ? "Gmail Service" : process.env.EMAIL_HOST);

    const config: any = isGmail ? {
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    } : {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_PORT === "465",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    return nodemailer.createTransport(config);
}

// ─── Core send ────────────────────────────────────────────────────────────────

export async function sendEmail(options: SendEmailOptions): Promise<void> {
    console.log(`[EMAIL] Attempting to send email to ${options.to} - Subject: ${options.subject}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("[EMAIL SKIPPED] No SMTP credentials found in process.env. Please check your .env file.");
        console.log("[EMAIL DATA]:", {
            to: options.to,
            subject: options.subject,
        });
        return;
    }

    try {
        const transporter = createTransporter();
        
        // Verify connection configuration
        await transporter.verify();
        console.log("[EMAIL] Transporter verified successfully.");

        const info = await transporter.sendMail({
            from: `"Hridganga 🪔" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });

        console.log(`[EMAIL SUCCESS] Message sent to ${options.to}. MessageID: ${info.messageId}`);
    } catch (error: any) {
        console.error(`[EMAIL ERROR] Failed to send email to ${options.to}:`, error);
        throw error; // Re-throw to let the caller handle it if needed
    }
}

// ─── Templates ───────────────────────────────────────────────────────────────

export function buildCustomerOrderEmail(data: OrderEmailData): string {
    const itemRows = data.items
        .map(
            (item) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ede8;">
          <span style="font-weight:600;color:#1a1a1a;">${item.name}</span><br/>
          <span style="font-size:12px;color:#888;">${item.volume} × ${item.quantity}</span>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #f0ede8;text-align:right;font-weight:600;color:#1a1a1a;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>`
        )
        .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmed – Hridganga</title>
</head>
<body style="margin:0;padding:0;background-color:#fdf9f3;font-family:'Gill Sans','Trebuchet MS',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf9f3;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#FF9933 0%,#e07b1c 100%);padding:48px 40px;text-align:center;">
              <div style="font-size:36px;margin-bottom:8px;">🪔</div>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Sacred Order Confirmed</h1>
              <p style="margin:8px 0 0;font-size:15px;color:rgba(255,255,255,0.85);">Order #${data.orderId}</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:40px 40px 24px;">
              <p style="margin:0 0 16px;font-size:17px;color:#333;line-height:1.7;">
                Namaste, <strong>${data.customerName}</strong> 🙏
              </p>
              <p style="margin:0;font-size:15px;color:#555;line-height:1.8;">
                Thank you for placing your order with <strong>Hridganga</strong>. We are deeply honoured to be a part of your spiritual journey. Your sacred Gangajal — sourced from the pristine heights of the Gangotri Glacier in the Himalayas — will be prepared and dispatched with the utmost care and reverence.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(to right,transparent,#e8ddd0,transparent);"></div>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding:24px 40px;">
              <h2 style="margin:0 0 16px;font-size:13px;font-weight:700;color:#FF9933;letter-spacing:0.12em;text-transform:uppercase;">Your Order</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #f0ede8;">
                ${itemRows}
                <tr>
                  <td style="padding:10px 16px;background:#fdf9f3;color:#888;font-size:13px;">Shipping</td>
                  <td style="padding:10px 16px;background:#fdf9f3;text-align:right;color:#888;font-size:13px;">$${data.shipping.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;font-weight:800;font-size:16px;color:#1a1a1a;">Total</td>
                  <td style="padding:14px 16px;text-align:right;font-weight:800;font-size:18px;color:#FF9933;">$${data.total.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding:0 40px 24px;">
              <h2 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#FF9933;letter-spacing:0.12em;text-transform:uppercase;">Shipping To</h2>
              <div style="background:#fdf9f3;border:1px solid #f0ede8;border-radius:12px;padding:16px 20px;font-size:14px;color:#555;line-height:1.8;">
                <strong style="color:#1a1a1a;">${data.shippingAddress.name}</strong><br/>
                ${data.shippingAddress.line1}${data.shippingAddress.line2 ? ", " + data.shippingAddress.line2 : ""}<br/>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br/>
                ${data.shippingAddress.country}
              </div>
            </td>
          </tr>

          <!-- Blessing message -->
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="background:linear-gradient(135deg,#fff8ef,#fff3e3);border:1px solid #fde4b8;border-radius:16px;padding:24px;text-align:center;">
                <p style="margin:0;font-size:15px;color:#8b5c1e;line-height:1.8;font-style:italic;">
                  "May the sacred waters of Ganga bless your home, your family, and every puja you perform. We will send you a delivery update as soon as your order is on its way."
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f7f2eb;padding:28px 40px;text-align:center;border-top:1px solid #ede8df;">
              <p style="margin:0 0 4px;font-size:13px;color:#999;">Need help? Reach us at</p>
              <p style="margin:0;font-size:13px;"><a href="mailto:support@hridganga.com" style="color:#FF9933;text-decoration:none;font-weight:600;">support@hridganga.com</a></p>
              <p style="margin:16px 0 0;font-size:11px;color:#bbb;">© ${new Date().getFullYear()} Hridganga · All rights reserved · Sourced from 10,000ft+</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildAdminNotificationEmail(data: OrderEmailData): string {
    const itemRows = data.items
        .map(
            (item) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #2a2a2a;color:#ccc;font-size:14px;">${item.name} (${item.volume})</td>
        <td style="padding:10px 16px;border-bottom:1px solid #2a2a2a;text-align:center;color:#ccc;font-size:14px;">${item.quantity}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #2a2a2a;text-align:right;color:#FF9933;font-weight:700;font-size:14px;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
        )
        .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Order – Hridganga Admin</title>
</head>
<body style="margin:0;padding:0;background-color:#111;font-family:'Gill Sans','Trebuchet MS',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1c1c1c;border-radius:20px;overflow:hidden;border:1px solid #2a2a2a;">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid #2a2a2a;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:36px;height:36px;background:#FF9933;border-radius:8px;display:inline-block;text-align:center;line-height:36px;font-size:18px;font-weight:800;color:#fff;">H</div>
                <span style="font-size:18px;font-weight:700;color:#fff;margin-left:10px;">Hridganga Admin</span>
                <span style="background:#FF9933;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-left:10px;letter-spacing:0.1em;text-transform:uppercase;">New Order</span>
              </div>
            </td>
          </tr>

          <!-- Alert -->
          <tr>
            <td style="padding:32px 40px 16px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#fff;">📦 New Order Received</h1>
              <p style="margin:0;font-size:14px;color:#888;">Order ID: <span style="color:#FF9933;font-weight:700;">#${data.orderId}</span> · ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            </td>
          </tr>

          <!-- Customer Info -->
          <tr>
            <td style="padding:0 40px 24px;">
              <div style="background:#242424;border-radius:12px;padding:20px;border:1px solid #2e2e2e;">
                <p style="margin:0 0 4px;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.1em;">Customer</p>
                <p style="margin:0;font-size:16px;font-weight:700;color:#fff;">${data.customerName}</p>
                <p style="margin:4px 0 0;font-size:13px;color:#FF9933;">${data.customerEmail}</p>
              </div>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding:0 40px 24px;">
              <h2 style="margin:0 0 12px;font-size:11px;font-weight:700;color:#666;letter-spacing:0.12em;text-transform:uppercase;">Items Ordered</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;">
                <thead>
                  <tr style="background:#242424;">
                    <th style="padding:10px 16px;text-align:left;font-size:11px;color:#666;font-weight:600;text-transform:uppercase;">Item</th>
                    <th style="padding:10px 16px;text-align:center;font-size:11px;color:#666;font-weight:600;text-transform:uppercase;">Qty</th>
                    <th style="padding:10px 16px;text-align:right;font-size:11px;color:#666;font-weight:600;text-transform:uppercase;">Amount</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
                <tr>
                  <td colspan="2" style="padding:14px 16px;font-weight:800;font-size:15px;color:#fff;">Total</td>
                  <td style="padding:14px 16px;text-align:right;font-weight:800;font-size:17px;color:#FF9933;">$${data.total.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding:0 40px 32px;">
              <h2 style="margin:0 0 12px;font-size:11px;font-weight:700;color:#666;letter-spacing:0.12em;text-transform:uppercase;">Ship To</h2>
              <div style="background:#242424;border:1px solid #2e2e2e;border-radius:12px;padding:16px 20px;font-size:13px;color:#aaa;line-height:1.8;">
                <strong style="color:#fff;">${data.shippingAddress.name}</strong><br/>
                ${data.shippingAddress.line1}${data.shippingAddress.line2 ? ", " + data.shippingAddress.line2 : ""}<br/>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}<br/>
                ${data.shippingAddress.country}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#161616;padding:20px 40px;text-align:center;border-top:1px solid #2a2a2a;">
              <p style="margin:0;font-size:11px;color:#444;">Hridganga Admin Panel · Internal notification</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
