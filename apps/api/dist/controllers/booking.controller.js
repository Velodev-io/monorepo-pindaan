"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookings = exports.createBooking = void 0;
const db_1 = require("@pinddaan/db");
const schemas_1 = require("@pinddaan/schemas");
const createBooking = async (req, res, next) => {
    try {
        const user = req.user;
        // Zod validates incoming body based on shared schema
        const data = schemas_1.createBookingSchema.parse(req.body);
        const booking = await db_1.prisma.booking.create({
            data: {
                userId: user.id,
                serviceId: data.serviceId,
                locationId: data.locationId,
                ritualDate: new Date(data.ritualDate),
                gotra: data.gotra,
                departedName: data.departedName,
                address: data.address
            }
        });
        return res.status(201).json({ success: true, booking });
    }
    catch (error) {
        next(error); // Sent to Central Error Handler
    }
};
exports.createBooking = createBooking;
const getBookings = async (req, res, next) => {
    try {
        const user = req.user;
        // Optional Prisma Query Optimization
        const bookings = await db_1.prisma.booking.findMany({
            where: { userId: user.id, isDeleted: false },
            include: { service: true, location: true },
            orderBy: { createdAt: "desc" }
        });
        return res.status(200).json({ success: true, data: bookings });
    }
    catch (error) {
        next(error);
    }
};
exports.getBookings = getBookings;
