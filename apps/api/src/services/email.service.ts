import nodemailer from "nodemailer";
import { ENV } from "@pinddaan/config";

const transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: Number(ENV.EMAIL_PORT),
    secure: Number(ENV.EMAIL_PORT) === 465,
    auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
    },
});

export const EmailService = {
    async sendUserConfirmation(userEmail: string, userName: string, bookingDetails: any) {
        console.log(`[EmailService] Attempting user confirmation for: ${userEmail}`);
        if (!ENV.EMAIL_USER) {
            console.warn("[EmailService] EMAIL_USER is missing from environment. Config keys:", Object.keys(ENV));
            return;
        }

        const mailOptions = {
            from: `"Pinddaan | Sacred Rituals" <${ENV.EMAIL_USER}>`,
            to: userEmail,
            subject: "Thank You for Your Trust - Your Ritual Booking is Confirmed",
            html: `
                <div style="font-family: 'serif', 'Georgia', 'Times New Roman', serif; background-color: #fffaf5; padding: 40px; border: 1px solid #ffedd5; border-radius: 20px; color: #431407;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #7c2d12; margin-bottom: 10px;">Dhanyavad, ${userName}</h1>
                        <p style="font-size: 18px; line-height: 1.6; color: #9a3412;">We are deeply honored that you have chosen us to assist in your family's sacred duties.</p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 25px; border-radius: 15px; border: 1px solid #fed7aa; margin-bottom: 30px;">
                        <h3 style="color: #7c2d12; border-bottom: 2px solid #fdba74; padding-bottom: 10px; margin-top: 0;">Ritual Summary</h3>
                        <p><strong>Departed Soul:</strong> ${bookingDetails.departedName}</p>
                        <p><strong>Scheduled Date:</strong> ${new Date(bookingDetails.ritualDate).toLocaleDateString()}</p>
                        <p><strong>Location:</strong> ${bookingDetails.locationName || "Sacred Ghats"}</p>
                    </div>

                    <p style="font-size: 16px; line-height: 1.8;">
                        Our coordinators and learned Pandits have been notified of your request. 
                        <strong>We will connect with you shortly</strong> via your registered contact number to provide guidance on the next steps and traditional preparations.
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.8;">
                        If there are any additional details or specific Shastric preferences you would like to add, please feel free to reply to this email or update your profile in the portal.
                    </p>

                    <div style="margin-top: 40px; text-align: center; border-top: 1px solid #fed7aa; pt: 30px;">
                        <p style="font-style: italic; color: #9a3412;">May the ancestors find eternal peace.</p>
                        <p style="font-size: 14px; margin-top: 20px;">The Pinddaan.store Team</p>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Confirmation email sent to ${userEmail}`);
        } catch (error) {
            console.error("Failed to send user email:", error);
        }
    },

    async sendAdminNotification(userDetails: any, bookingDetails: any) {
        console.log(`[EmailService] Attempting admin notification to: ${ENV.ADMIN_EMAIL}`);
        if (!ENV.EMAIL_USER) {
            console.warn("[EmailService] EMAIL_USER is missing from environment.");
            return;
        }

        const mailOptions = {
            from: `"System Alert | Pinddaan" <${ENV.EMAIL_USER}>`,
            to: ENV.ADMIN_EMAIL,
            subject: `New Booking Alert - ${userDetails.name}`,
            html: `
                <div style="font-family: sans-serif; background-color: #f4f4f5; padding: 30px; border-radius: 10px;">
                    <h2 style="color: #18181b;">Action Required: New Ritual Booking</h2>
                    <p>You have received a new booking from <strong>${userDetails.name}</strong>.</p>
                    
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <h3 style="margin-top: 0; color: #71717a;">Customer Details</h3>
                        <p><strong>Name:</strong> ${userDetails.name}</p>
                        <p><strong>Email:</strong> ${userDetails.email}</p>
                        <p><strong>Phone:</strong> ${userDetails.phone || "Not provided"}</p>
                        
                        <h3 style="margin-top: 25px; color: #71717a;">Ritual Details</h3>
                        <p><strong>Service:</strong> ${bookingDetails.serviceName || "Sacred Ritual"}</p>
                        <p><strong>Location:</strong> ${bookingDetails.locationName || "Varanasi"}</p>
                        <p><strong>Departed Name:</strong> ${bookingDetails.departedName}</p>
                        <p><strong>Gotra:</strong> ${bookingDetails.gotra || "N/A"}</p>
                        <p><strong>Scheduled Date:</strong> ${new Date(bookingDetails.ritualDate).toLocaleDateString()}</p>
                    </div>
                    
                    <p style="margin-top: 25px;">
                        <a href="http://localhost:3002/bookings" style="background-color: #d97706; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            View in Admin Panel
                        </a>
                    </p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Admin notification sent to ${ENV.ADMIN_EMAIL}`);
        } catch (error) {
            console.error("Failed to send admin notification:", error);
        }
    }
};
