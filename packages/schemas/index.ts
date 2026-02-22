import { z } from "zod";
import { BookingStatus, PaymentStatus } from "@pinddaan/types";

export const createBookingSchema = z.object({
    serviceId: z.string(),
    locationId: z.string(),
    ritualDate: z.string(),
    address: z.string().optional(),
    departedName: z.string(),
    gotra: z.string().optional(),
    cremationDate: z.string().optional(),
    fatherName: z.string().optional(),
    contactPhone: z.string().optional()
});

export const updateBookingStatusSchema = z.object({
    status: z.nativeEnum(BookingStatus),
    adminNotes: z.string().optional()
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingStatusSchema>;
