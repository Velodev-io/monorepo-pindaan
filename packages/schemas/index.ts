import { z } from "zod";
import { BookingStatus, PaymentStatus, OrderStatus } from "@pinddaan/types";

export const ProofVideoSchema = z.object({
    status: z.enum(["NOT_AVAILABLE", "PROCESSING", "AVAILABLE"]),
    videoUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    recordedAt: z.string().optional(),
    notes: z.string().optional(),
    watermarkText: z.string().optional(),
});

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

export const userContactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    email: z.string().email("Valid email is required"),
});

export const shippingAddressSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Phone is required"),
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State/Province is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    landmark: z.string().optional(),
});

export type UserContactInput = z.infer<typeof userContactSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

export const ProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    sku: z.string().min(1, "SKU is required"),
    volumeMl: z.number().positive("Volume must be positive"),
    price: z.number().positive("Price must be positive"),
    currency: z.string().default("USD"),
    isActive: z.boolean().default(true),
    description: z.string(),
});

export const OrderStatusUpdateSchema = z.object({
    status: z.nativeEnum(OrderStatus),
    trackingNumber: z.string().optional(),
    carrier: z.string().optional(),
});

export const ShippingRateSchema = z.object({
    country: z.string().min(1, "Country code is required"),
    zoneName: z.string().min(1, "Zone name is required"),
    baseRate: z.number().min(0, "Base rate cannot be negative"),
    perItemRate: z.number().min(0, "Per item rate cannot be negative"),
    isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof ProductSchema>;
export type OrderStatusUpdateInput = z.infer<typeof OrderStatusUpdateSchema>;
export type ShippingRateInput = z.infer<typeof ShippingRateSchema>;
