import { ServiceKey } from './services';

export interface LocationService {
    id: string;
    locationId: string;
    service: ServiceKey;
    isPrimary: boolean;
    notes?: string | null;
}

export interface Location {
    id: string;
    name: string;
    state: string;
    slug: string;
    description?: string | null;
    isActive: boolean;
    services: LocationService[];
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface CreateLocationDto {
    name: string;
    state: string;
    description?: string;
    isActive?: boolean;
    services: {
        service: ServiceKey;
        isPrimary: boolean;
        notes?: string;
    }[];
}

export interface UpdateLocationDto extends Partial<CreateLocationDto> { }

export interface MultiLocationResponse {
    commonLocations: { id: string; name: string; state: string }[];
    serviceLocations: Partial<Record<ServiceKey, { id: string; name: string; state: string }[]>>;
}
