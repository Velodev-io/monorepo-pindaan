import { prisma } from "@pinddaan/db";
import { verifyIdToken } from "./firebase-admin";

export const verifyFirebaseTokenMiddleware = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = await verifyIdToken(token);
        req.firebaseUser = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export const authMiddleware = async (req: any, res: any, next: any) => {
    verifyFirebaseTokenMiddleware(req, res, async () => {
        try {
            const user = await prisma.user.findUnique({ where: { id: req.firebaseUser.uid } });
            if (!user || (!user.isActive)) {
                return res.status(401).json({ error: "Unauthorized: Inactive or Missing User" });
            }
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({ error: "Database error" });
        }
    });
};

export const roleGuard = (...allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient Permissions" });
        }
        next();
    };
};

export * from "./firebase-admin";
