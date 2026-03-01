import { apiClient } from "../lib/api-client";
import { ShippingRate } from "@pinddaan/types";
import { ShippingRateInput } from "@pinddaan/schemas";

export const ShippingService = {
    async getAll(): Promise<{ data: ShippingRate[] }> {
        return apiClient("/shipping-rates");
    },
    async create(input: ShippingRateInput): Promise<ShippingRate> {
        return apiClient("/shipping-rates", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },
    async update(id: string, input: Partial<ShippingRateInput>): Promise<ShippingRate> {
        return apiClient(`/shipping-rates/${id}`, {
            method: "PATCH",
            body: JSON.stringify(input),
        });
    },
    async toggleActive(id: string, isActive: boolean): Promise<ShippingRate> {
        return apiClient(`/shipping-rates/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ isActive }),
        });
    },
};
