# Pinddaan.store - Turborepo Monorepo Architecture

This document defines the production-grade, highly scalable Monorepo architecture for Pinddaan.store using **Turborepo**, **Next.js**, **Express/Next API**, **Prisma**, and **Shared Packages**.

---

## 1. Monorepo Folder Structure

```text
pinddaan-monorepo/
├── apps/
│   ├── web/                     # Next.js App Router (Customer Facing)
│   ├── admin/                   # Next.js App Router (Internal Dashboard)
│   └── api/                     # Node.js/Express Backend (or Next API)
│       ├── src/
│       │   ├── routes/          # Express Routers
│       │   ├── controllers/     # Req/Res handling
│       │   ├── services/        # Business logic
│       │   ├── repositories/    # DB queries wrapper
│       │   └── middlewares/     # App-specific middlewares
├── packages/
│   ├── ui/                      # Shared React components (Tailwind + shadcn/ui)
│   ├── config/                  # Shared ESLint, TSConfig, Prettier
│   ├── types/                   # Shared TypeScript interfaces
│   ├── schemas/                 # Shared Zod validation schemas
│   ├── database/                # Prisma schema, client, and migrations
│   ├── auth/                    # Shared Auth logic (Firebase Admin/JWT middleware)
│   ├── constants/               # Global enums and status dicts
│   ├── utils/                   # Shared helpers (date parsing, currency formatter)
│   ├── logger/                  # Pino/Winston centralized logging
│   ├── payments/                # Stripe/Razorpay unified wrapper
│   ├── storage/                 # AWS S3 helpers (signed URLs)
│   └── analytics/               # Aggregation queries for dashboards
├── turbo.json                   # Turborepo build pipeline
├── package.json                 # Workspace root config (Yarn workspaces)
└── .env                         # Environment variables
```

---

## 2. Package Management

- **Yarn** is used as the strict package manager (`yarn workspaces`).
- Instead of relying on `npm` and `package-lock.json`, the repository relies securely on `yarn.lock`.
- Start the server using:
  ```sh
  # Install dependencies across all packages
  yarn install
  
  # Boot up everything in parallel with remote caching
  yarn run dev
  
  # Compiles TypeScript and builds Next.js pages
  yarn run build
  ```

---

## 3. Shared Database Layer (`packages/db/prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String     @id // Maps to Firebase UID
  email     String     @unique
  name      String
  phone     String?
  role      UserRole   @default(USER)
  isActive  Boolean    @default(true)
  bookings  Booking[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

// See packages/db for details including Enums and Booking/Service models.
```

---

## 4. Shared Types (`packages/types/index.ts`)

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
```

---

## 5. Shared Zod Schemas (`packages/schemas/index.ts`)

```typescript
import { z } from "zod";

export const CreateBookingSchema = z.object({
  serviceId: z.string().uuid(),
  locationId: z.string().uuid(),
  ritualDate: z.string().datetime(), // ISO 8601
  gotra: z.string().optional(),
  departedName: z.string().min(2),
});
```

---

## 6. Shared Auth Module (`packages/auth/index.ts`)

```typescript
import { getAuth } from "firebase-admin/auth";
import { prisma } from "@pinddaan/db";
import type { Request, Response, NextFunction } from "express";

export async function verifyFirebaseToken(token: string) {
  return await getAuth().verifyIdToken(token);
}

// Express Middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = await verifyFirebaseToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.uid } });
    
    if (!user || (!user.isActive)) throw new Error();
    
    (req as any).user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
```

---

## 7. Production Deployment Architecture (AWS / Vercel)

1. **Frontend (Web + Admin):** Deploy to **Vercel** or **AWS Amplify**. Turborepo automatically caches builds.
2. **Backend API:** Deploy `apps/api` (Express/Node) container to **AWS ECS (Fargate)**, **Railway**, or **Render**. Next API routes can deploy natively on Vercel.
3. **Database:** Host PostgreSQL on **Neon** or **AWS RDS**.
4. **Build Pipeline:** `yarn run build` smartly compiles `packages/*` first, then injects them into `apps/*` using internal symlinks. Maximum CI/CD speed.
