import { apiClient } from "../lib/api-client";
import { Product } from "@pinddaan/types";
import { ProductInput } from "@pinddaan/schemas";

export const ProductService = {
    async getAll(): Promise<{ data: Product[]; total: number }> {
        return apiClient("/products");
    },
    async create(input: ProductInput): Promise<Product> {
        return apiClient("/products", {
            method: "POST",
            body: JSON.stringify(input),
        });
    },
    async update(id: string, input: Partial<ProductInput>): Promise<Product> {
        return apiClient(`/products/${id}`, {
            method: "PATCH",
            body: JSON.stringify(input),
        });
    },
    async toggleActive(id: string, isActive: boolean): Promise<Product> {
        return apiClient(`/products/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ isActive }),
        });
    },
};
