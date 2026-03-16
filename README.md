# Hridganga Monorepo 🌿

Hridganga (formerly Pinddaan) is a sacred digital ecosystem dedicated to delivering the pure, Himalayan currents of the Holy Ganges and providing spiritual services. This monorepo manages the entire infrastructure, including the public-facing storefront, the administrative dashboard, and the core API services.

## 🏗️ Architecture

This project is a TypeScript monorepo managed with **Turbo**, structured as follows:

### Apps
- **[gangajal-web](apps/gangajal-web)**: The public storefront and devotee experience portal. Built with Next.js and Tailwind CSS.
- **[gangajal-admin](apps/gangajal-admin)**: The internal dashboard for managing products, orders, and devotee reviews. 
- **[api](apps/api)**: The central Express server providing core business logic and database access.

### Packages
- **[db](packages/db)**: Shared Prisma client and database schema (PostgreSQL via Neon).
- **[email](packages/email)**: Centralized email dispatching service for devotee notifications and admin alerts.
- **[auth](packages/auth)**: Shared authentication middleware and Firebase integration.
- **[types](packages/types)**: Common TypeScript interfaces and shared types.

## ✨ Key Features

- **Devotee Experience System**: Real-time reviews from around the globe, managed through a secure admin verification flow.
- **Sacred Commerce**: Seamless ordering of pure Himalayan Gangajal with automated order tracking.
- **Secure Infrastructure**: Enterprise-grade security with Role-Based Access Control (RBAC) and Firebase-backed authentication.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Neon.tech recommended)
- Firebase Account (for Authentication)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   Each app has its own `.env.example`. Ensure you configure these for your local environment.
4. Push database schema:
   ```bash
   npx turbo db:push
   ```

### Development
Run all services concurrently:
```bash
npm run dev
```

## 📜 Commands
- `npm run build`: Build all applications and packages.
- `npm run dev`: Start all services in development mode.
- `npm run lint`: Run linting across the entire monorepo.

---
© 2026 Hridganga. Sacred Currents, Delivered.
