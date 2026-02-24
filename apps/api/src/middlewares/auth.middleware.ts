import { Request, Response, NextFunction } from "express";
import { verifyIdToken } from "@pinddaan/auth";
import { prisma } from "@pinddaan/db";

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await verifyIdToken(token);

        // Fetch user from DB to get the role
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.uid },
        });

        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found in database" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

export const isAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
        return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
    next();
};
