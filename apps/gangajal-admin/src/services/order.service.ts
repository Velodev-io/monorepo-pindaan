import { apiClient } from "../lib/api-client";
import { Order, OrderStatus } from "@pinddaan/types";

export const OrderService = {
    async getAll(
        page = 1,
        limit = 20,
        status?: string
    ): Promise<{ data: Order[]; total: number }> {
        let query = `/orders?page=${page}&limit=${limit}`;
        if (status && status !== "ALL") query += `&status=${status}`;
        return apiClient(query);
    },
    async getById(id: string): Promise<{ success: boolean; data: Order }> {
        return apiClient(`/orders/${id}`);
    },
    async update(id: string, updateData: any): Promise<{ success: boolean; data: Order }> {
        return apiClient(`/orders/${id}`, {
            method: "PATCH",
            body: JSON.stringify(updateData),
        });
    },
    async getRecentOrders(limit = 5): Promise<{ success: boolean; data: Order[] }> {
        return apiClient(`/orders/recent?limit=${limit}`);
    }
};
