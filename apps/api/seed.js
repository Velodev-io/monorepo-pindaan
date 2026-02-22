const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const SERVICES = [
    { id: "asthi-visarjan", name: "Asthi Visarjan", basePrice: 299 },
    { id: "pind-daan", name: "Pind Daan", basePrice: 349 },
    { id: "shraddh", name: "Shraddh", basePrice: 249 },
    { id: "tarpan", name: "Tarpan", basePrice: 199 }
];

const LOCATIONS = [
    { id: "varanasi", name: "Varanasi" },
    { id: "haridwar", name: "Haridwar" },
    { id: "prayagraj", name: "Prayagraj" }
];

async function main() {
    console.log("Seeding services...");
    for (const service of SERVICES) {
        await prisma.service.upsert({
            where: { id: service.id },
            update: {},
            create: service
        });
    }

    console.log("Seeding locations...");
    for (const loc of LOCATIONS) {
        await prisma.location.upsert({
            where: { id: loc.id },
            update: {},
            create: loc
        });
    }

    console.log("Seeding complete!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
