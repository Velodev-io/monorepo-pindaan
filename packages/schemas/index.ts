import { z } from "zod";
import { BookingStatus, PaymentStatus } from "@pinddaan/types";

export const createBookingSchema = z.object({
    serviceId: z.string().uuid(),
    locationId: z.string().uuid(),
    ritualDate: z.string().datetime(),
    address: z.string().min(10).optional(),
    departedName: z.string().min(2),
    gotra: z.string().optional(),
    cremationDate: z.string().datetime().optional(),
    fatherName: z.string().optional()
});

export const updateBookingStatusSchema = z.object({
    status: z.nativeEnum(BookingStatus),
    adminNotes: z.string().optional()
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingStatusSchema>;
