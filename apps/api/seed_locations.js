const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const LOCATIONS = [
    { name: "Gaya", state: "Bihar", services: ["PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Varanasi", state: "UP", services: ["ASTHI_VISARJAN", "PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Haridwar", state: "Uttarakhand", services: ["ASTHI_VISARJAN", "PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Prayagraj", state: "UP", services: ["ASTHI_VISARJAN", "PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Kurukshetra", state: "Haryana", services: ["PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Siddhpur", state: "Gujarat", services: ["PIND_DAAN", "SHRADDH"] },
    { name: "Nashik", state: "Maharashtra", services: ["ASTHI_VISARJAN", "PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Pushkar", state: "Rajasthan", services: ["PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Somnath", state: "Gujarat", services: ["ASTHI_VISARJAN", "PIND_DAAN"] },
];

const SERVICES_DATA = [
    { id: "ASTHI_VISARJAN", name: "Asthi Visarjan", basePrice: 299 },
    { id: "PIND_DAAN", name: "Pind Daan", basePrice: 349 },
    { id: "SHRADDH", name: "Shraddh", basePrice: 249 },
    { id: "TARPAN", name: "Tarpan", basePrice: 199 },
];

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
};

async function main() {
    console.log("Seeding services...");
    for (const s of SERVICES_DATA) {
        await prisma.service.upsert({
            where: { id: s.id },
            update: { basePrice: s.basePrice, name: s.name },
            create: s,
        });
    }

    console.log("Cleaning up old location services...");
    await prisma.locationService.deleteMany({});

    console.log("Seeding diversified locations mapping system...");

    for (const loc of LOCATIONS) {
        const slug = slugify(loc.name);
        console.log(`Processing ${loc.name} with ${loc.services.length} services...`);

        await prisma.location.upsert({
            where: { slug },
            update: {
                name: loc.name,
                state: loc.state,
                isActive: true,
            },
            create: {
                name: loc.name,
                state: loc.state,
                slug,
                description: `Sacred rituals performed at ${loc.name}, ${loc.state}.`,
                isActive: true,
            },
        });

        const location = await prisma.location.findUnique({ where: { slug } });

        if (location) {
            await prisma.locationService.createMany({
                data: loc.services.map((service) => ({
                    locationId: location.id,
                    service,
                    isPrimary: service === "PIND_DAAN" || (loc.name === "Somnath" && service === "ASTHI_VISARJAN"),
                    notes: `Traditional ${service.replace("_", " ")} services available at ${loc.name}.`,
                })),
            });
        }
    }

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
