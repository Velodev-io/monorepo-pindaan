import { apiClient } from "../lib/api-client";
import { MultiLocationResponse, ServiceKey } from "@pinddaan/shared";

export const LocationService = {
    async getMultiServiceLocations(services: ServiceKey[]): Promise<{
        success: boolean;
        data: MultiLocationResponse
    }> {
        const serviceString = services.join(",");
        return apiClient(`/locations/multi?services=${serviceString}`);
    }
};
