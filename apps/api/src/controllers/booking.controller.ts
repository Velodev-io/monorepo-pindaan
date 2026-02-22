import { Request, Response, NextFunction } from "express";
import { prisma } from "@pinddaan/db";
import { createBookingSchema } from "@pinddaan/schemas";
import { EmailService } from "../services/email.service";

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        console.log("Incoming Booking Body:", JSON.stringify(req.body, null, 2));

        // Zod validates incoming body based on shared schema
        const data = createBookingSchema.parse(req.body);

        if (data.contactPhone) {
            await prisma.user.update({
                where: { id: user.id },
                data: { phone: data.contactPhone }
            });
        }

        const booking = await prisma.booking.create({
            data: {
                userId: user.id,
                serviceId: data.serviceId,
                locationId: data.locationId,
                ritualDate: new Date(data.ritualDate),
                gotra: data.gotra,
                departedName: data.departedName,
                address: data.address,
                cremationDate: data.cremationDate ? new Date(data.cremationDate) : null,
                fatherName: data.fatherName
            },
            include: {
                service: true,
                location: true
            }
        });

        // Trigger Emails (Asynchronously)
        EmailService.sendUserConfirmation(user.email, user.name, {
            departedName: booking.departedName,
            ritualDate: booking.ritualDate,
            locationName: booking.location?.name
        });

        EmailService.sendAdminNotification(user, {
            serviceName: booking.service?.name,
            locationName: booking.location?.name,
            departedName: booking.departedName,
            gotra: booking.gotra,
            ritualDate: booking.ritualDate
        });

        return res.status(201).json({ success: true, booking });
    } catch (error) {
        next(error); // Sent to Central Error Handler
    }
};

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        // If ADMIN or SUPER_ADMIN, return all bookings. Otherwise, only user's bookings.
        const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

        let queryOptions: any = {
            where: { isDeleted: false },
            include: { user: true, service: true, location: true, pandit: true },
            orderBy: { createdAt: "desc" }
        };

        if (req.query.status) {
            queryOptions.where.status = req.query.status;
        }

        if (!isAdmin) {
            queryOptions.where.userId = user.id;
        }

        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        queryOptions.take = limit;
        queryOptions.skip = (page - 1) * limit;

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany(queryOptions),
            prisma.booking.count({ where: queryOptions.where })
        ]);

        return res.status(200).json({ success: true, data: bookings, total });
    } catch (error) {
        next(error);
    }
}

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await prisma.booking.update({
            where: { id },
            data: { status }
        });

        return res.status(200).json({ success: true, booking });
    } catch (error) {
        next(error);
    }
}
