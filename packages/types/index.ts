export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
    PANDIT = "PANDIT"
}

export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}

export interface User {
    id: string; // Firebase UID
    email: string;
    name: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface Service {
    id: string;
    name: string;
    basePrice: number;
    isActive: boolean;
    category?: string;
}

export interface Location {
    id: string;
    name: string;
    isActive: boolean;
}

export interface Booking {
    id: string;
    userId: string;
    user?: User;
    serviceId: string;
    service?: Service;
    locationId: string;
    location?: Location;
    panditId?: string;
    status: BookingStatus;
    ritualDate: string | Date;
    departedName: string;
    gotra?: string;
    address?: string;
    cremationDate?: string | Date;
    fatherName?: string;
    adminNotes?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}
