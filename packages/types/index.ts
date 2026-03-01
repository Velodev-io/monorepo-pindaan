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
export enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    PACKED = "PACKED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}

export interface ShippingAddress {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    landmark?: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    amount: number;
    currency: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    shippingAddress: ShippingAddress;
    trackingNumber?: string;
    carrier?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    volumeMl: number;
    price: number;
    currency: string;
    isActive: boolean;
    description: string;
}

export interface ShippingRate {
    id: string;
    country: string;
    zoneName: string;
    baseRate: number;
    perItemRate: number;
    isActive: boolean;
}
