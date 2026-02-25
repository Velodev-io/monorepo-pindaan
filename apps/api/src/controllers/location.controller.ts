import { Request, Response } from "express";
import { prisma } from "@pinddaan/db";
import { z } from "zod";

const locationServiceSchema = z.object({
    service: z.enum(["ASTHI_VISARJAN", "PIND_DAAN", "SHRADDH", "TARPAN"]),
    isPrimary: z.boolean().default(false),
    notes: z.string().optional(),
});

const createLocationSchema = z.object({
    name: z.string().min(1),
    state: z.string().min(1),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    services: z.array(locationServiceSchema).min(1).refine(
        (services) => services.filter(s => s.isPrimary).length <= 1,
        { message: "Only one service can be marked as primary" }
    ),
});

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
};

const formatLocation = (loc: any) => {
    if (!loc) return null;
    const { locationServices, ...rest } = loc;
    return {
        ...rest,
        services: locationServices || []
    };
};

export const createLocation = async (req: Request, res: Response) => {
    try {
        const validatedData = createLocationSchema.parse(req.body);
        const slug = slugify(validatedData.name);

        // Check if slug exists
        const existing = await prisma.location.findUnique({ where: { slug } });
        if (existing) {
            return res.status(400).json({ error: "Location with this name already exists (slug conflict)" });
        }

        const location = await prisma.location.create({
            data: {
                name: validatedData.name,
                state: validatedData.state,
                slug,
                description: validatedData.description,
                isActive: validatedData.isActive,
                locationServices: {
                    create: validatedData.services.map((s) => ({
                        service: s.service,
                        isPrimary: s.isPrimary,
                        notes: s.notes,
                    })),
                },
            },
            include: {
                locationServices: true,
            },
        });

        return res.status(201).json({ success: true, data: formatLocation(location) });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Validation Error", details: error.issues });
        }
        console.error("Create Location Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllLocations = async (req: Request, res: Response) => {
    try {
        const locations = await prisma.location.findMany({
            include: {
                locationServices: true,
            },
            orderBy: { name: "asc" },
        });

        return res.json({ success: true, data: locations.map(formatLocation) });
    } catch (error) {
        console.error("Get All Locations Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getLocationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const location = await prisma.location.findUnique({
            where: { id },
            include: {
                locationServices: true,
            },
        });

        if (!location) {
            return res.status(404).json({ error: "Location not found" });
        }

        return res.json({ success: true, data: formatLocation(location) });
    } catch (error) {
        console.error("Get Location By ID Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateLocation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validatedData = createLocationSchema.partial().parse(req.body);

        const existingLocation = await prisma.location.findUnique({ where: { id } });
        if (!existingLocation) {
            return res.status(404).json({ error: "Location not found" });
        }

        const data: any = {
            name: validatedData.name,
            state: validatedData.state,
            description: validatedData.description,
            isActive: validatedData.isActive,
        };

        if (validatedData.name) {
            data.slug = slugify(validatedData.name);
        }

        const result = await prisma.$transaction(async (tx) => {
            // If services are provided, replace them
            if (validatedData.services) {
                await tx.locationService.deleteMany({
                    where: { locationId: id },
                });

                data.locationServices = {
                    create: validatedData.services.map((s) => ({
                        service: s.service,
                        isPrimary: s.isPrimary,
                        notes: s.notes,
                    })),
                };
            }

            return await tx.location.update({
                where: { id },
                data,
                include: {
                    locationServices: true,
                },
            });
        });

        return res.json({ success: true, data: formatLocation(result) });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Validation Error", details: error.issues });
        }
        console.error("Update Location Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteLocation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Soft delete
        await prisma.location.update({
            where: { id },
            data: { isActive: false },
        });

        return res.json({ success: true, message: "Location deactivated successfully" });
    } catch (error) {
        console.error("Delete Location Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getPublicLocations = async (req: Request, res: Response) => {
    try {
        const { service } = req.query;

        if (!service) {
            return res.status(400).json({ error: "Service parameter is required" });
        }

        const locations = await prisma.location.findMany({
            where: {
                isActive: true,
                locationServices: {
                    some: {
                        service: service as any,
                    },
                },
            },
            include: {
                locationServices: {
                    where: {
                        service: service as any,
                    },
                },
            },
        });

        // Flatten notes and primary flag for the specific service
        const formattedLocations = locations.map((loc) => {
            const serviceInfo = loc.locationServices[0];
            return {
                id: loc.id,
                name: loc.name,
                state: loc.state,
                slug: loc.slug,
                description: loc.description,
                isPrimary: serviceInfo?.isPrimary || false,
                notes: serviceInfo?.notes || null,
            };
        });

        return res.json({ success: true, data: formattedLocations });
    } catch (error) {
        console.error("Get Public Locations Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getMultiServiceLocations = async (req: Request, res: Response) => {
    try {
        const { services } = req.query;

        if (!services) {
            return res.status(400).json({ error: "Services parameter is required" });
        }

        const serviceKeys = (services as string).split(",") as any[];
        console.log("[DEBUG] getMultiServiceLocations - Requested Services:", serviceKeys);

        // Fetch all active locations that support at least one of these services
        const locations = await prisma.location.findMany({
            where: {
                isActive: true,
                locationServices: {
                    some: {
                        service: { in: serviceKeys },
                    },
                },
            },
            include: {
                locationServices: true,
            },
        });

        console.log(`[DEBUG] getMultiServiceLocations - Found ${locations.length} locations matching at least one service`);

        const commonLocations: any[] = [];
        const serviceLocations: Record<string, any[]> = {};

        // Initialize serviceLocations with empty arrays for provided keys
        serviceKeys.forEach(key => {
            serviceLocations[key] = [];
        });

        locations.forEach(loc => {
            const supportedServices = loc.locationServices.map(ls => ls.service);
            console.log(`[DEBUG] Location ${loc.name} supports:`, supportedServices);

            // Check if common (supports ALL requested services)
            const isCommon = serviceKeys.every(sk => supportedServices.includes(sk));
            if (isCommon) {
                console.log(`[DEBUG] Adding ${loc.name} to commonLocations`);
                commonLocations.push({
                    id: loc.id,
                    name: loc.name,
                    state: loc.state
                });
            }

            // Add to individual service lists if supported
            serviceKeys.forEach(sk => {
                if (supportedServices.includes(sk)) {
                    console.log(`[DEBUG] Adding ${loc.name} to serviceLocations[${sk}]`);
                    serviceLocations[sk].push({
                        id: loc.id,
                        name: loc.name,
                        state: loc.state
                    });
                }
            });
        });

        console.log("[DEBUG] getMultiServiceLocations - Final Response Data:", {
            commonLocationsCount: commonLocations.length,
            serviceLocationsKeys: Object.keys(serviceLocations),
            serviceLocationsCounts: Object.entries(serviceLocations).map(([k, v]) => `${k}: ${v.length}`)
        });

        return res.json({
            success: true,
            data: {
                commonLocations,
                serviceLocations
            }
        });

    } catch (error) {
        console.error("Get Multi Service Locations Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
