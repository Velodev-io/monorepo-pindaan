import { z } from 'zod';

export const createBookingSchema = z.object({
    serviceId: z.string().uuid("Invalid service ID"),
    locationId: z.string().uuid("Invalid location ID"),
    ritualDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid ISO date string"),
    departedName: z.string().min(2, "Name must be at least 2 characters").max(100),
    gotra: z.string().optional(),
    dateOfDeath: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid ISO date string").optional(),
    customerNotes: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
