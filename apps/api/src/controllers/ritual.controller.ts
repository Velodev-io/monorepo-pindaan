import { Request, Response } from "express";
import { prisma } from "@pinddaan/db";

export const getServices = async (req: Request, res: Response) => {
    try {
        const services = await prisma.service.findMany({
            orderBy: { name: "asc" }
        });

        return res.json({
            success: true,
            data: services
        });
    } catch (error) {
        console.error("Get Services Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createService = async (req: Request, res: Response) => {
    try {
        const { name, basePrice, isActive } = req.body;

        if (!name || basePrice === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const service = await prisma.service.create({
            data: {
                name,
                basePrice: parseFloat(basePrice.toString()),
                isActive: isActive ?? true
            }
        });

        return res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error("Create Service Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, basePrice, isActive } = req.body;

        const service = await prisma.service.update({
            where: { id },
            data: {
                name,
                basePrice: basePrice !== undefined ? parseFloat(basePrice.toString()) : undefined,
                isActive
            }
        });

        return res.json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error("Update Service Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteService = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.service.delete({
            where: { id }
        });

        return res.json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error) {
        console.error("Delete Service Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
