import { apiClient } from "../lib/api-client";
import { Order, OrderStatus } from "@pinddaan/types";
import { OrderStatusUpdateInput } from "@pinddaan/schemas";

export const OrderService = {
    async getAll(
        page = 1,
        limit = 20,
        status?: OrderStatus
    ): Promise<{ data: Order[]; total: number }> {
        let query = `/orders?page=${page}&limit=${limit}`;
        if (status) query += `&status=${status}`;
        return apiClient(query);
    },
    async updateStatus(orderId: string, update: OrderStatusUpdateInput): Promise<Order> {
        return apiClient(`/orders/${orderId}/status`, {
            method: "PATCH",
            body: JSON.stringify(update),
        });
    },
};
