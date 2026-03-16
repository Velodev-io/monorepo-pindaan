import { apiClient } from "../lib/api-client";
import { BookingStatus } from "@pinddaan/types";

// Note: Reusing generic types from DB/types package
export const BookingService = {
    async getBookings(page = 1, limit = 10, status?: string) {
        let query = `/bookings?page=${page}&limit=${limit}`;
        if (status) query += `&status=${status}`;

        return apiClient(query);
    },
    async updateStatus(bookingId: string, status: BookingStatus) {
        return apiClient(`/bookings/${bookingId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        });
    }
};
