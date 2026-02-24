import { apiClient } from "../lib/api-client";
import { CreateLocationDto, UpdateLocationDto, Location } from "@pinddaan/shared";

export const LocationService = {
    async getLocations(): Promise<{ success: boolean; data: Location[] }> {
        return apiClient("/admin/locations");
    },
    async getLocationById(id: string): Promise<{ success: boolean; data: Location }> {
        return apiClient(`/admin/locations/${id}`);
    },
    async createLocation(data: CreateLocationDto): Promise<{ success: boolean; data: Location }> {
        return apiClient("/admin/locations", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
    async updateLocation(id: string, data: UpdateLocationDto): Promise<{ success: boolean; data: Location }> {
        return apiClient(`/admin/locations/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },
    async deleteLocation(id: string): Promise<{ success: boolean; message: string }> {
        return apiClient(`/admin/locations/${id}`, {
            method: "DELETE",
        });
    },
};
