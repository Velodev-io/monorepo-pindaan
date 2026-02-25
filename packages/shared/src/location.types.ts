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
    image?: string | null;
    isActive: boolean;
    services: LocationService[];
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface CreateLocationDto {
    name: string;
    state: string;
    description?: string;
    image?: string;
    isActive?: boolean;
    services: {
        service: ServiceKey;
        isPrimary: boolean;
        notes?: string;
    }[];
}

export interface UpdateLocationDto extends Partial<CreateLocationDto> { }

export interface MultiLocationResponse {
    commonLocations: { id: string; name: string; state: string; image?: string | null }[];
    serviceLocations: Partial<Record<ServiceKey, { id: string; name: string; state: string; image?: string | null }[]>>;
}
