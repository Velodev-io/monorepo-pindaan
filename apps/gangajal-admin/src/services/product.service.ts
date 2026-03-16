import { apiClient } from "../lib/api-client";
import { Product } from "@pinddaan/types";

export const ProductService = {
    async getAll(isActive?: boolean): Promise<{ success: boolean; data: Product[] }> {
        let query = `/products`;
        if (isActive !== undefined) {
            query += `?isActive=${isActive}`;
        }
        return apiClient(query);
    },
    async getById(id: string): Promise<{ success: boolean; data: Product }> {
        return apiClient(`/products/${id}`);
    },
    async create(data: Partial<Product>): Promise<{ success: boolean; data: Product }> {
        return apiClient(`/products`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
    async update(id: string, data: Partial<Product>): Promise<{ success: boolean; data: Product }> {
        return apiClient(`/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },
    async delete(id: string): Promise<{ success: boolean; message: string }> {
        return apiClient(`/products/${id}`, {
            method: "DELETE",
        });
    }
};
