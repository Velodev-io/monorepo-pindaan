const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const LOCATIONS = [
    { name: "Gaya", state: "Bihar" },
    { name: "Varanasi", state: "UP" },
    { name: "Haridwar", state: "Uttarakhand" },
    { name: "Prayagraj", state: "UP" },
    { name: "Kurukshetra", state: "Haryana" },
    { name: "Siddhpur", state: "Gujarat" },
    { name: "Nashik", state: "Maharashtra" },
    { name: "Pushkar", state: "Rajasthan" },
    { name: "Somnath", state: "Gujarat" },
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

    console.log("Seeding locations mapping system...");

    const SERVICE_KEYS = SERVICES_DATA.map((s) => s.id);

    for (const loc of LOCATIONS) {
        const slug = slugify(loc.name);
        console.log(`Processing ${loc.name}...`);

        await prisma.location.upsert({
            where: { slug },
            update: {},
            create: {
                name: loc.name,
                state: loc.state,
                slug,
                description: `Sacred rituals performed at ${loc.name}, ${loc.state}.`,
                isActive: true,
                locationServices: {
                    create: SERVICE_KEYS.map((service) => ({
                        service,
                        isPrimary: service === "PIND_DAAN",
                        notes: `Traditional ${service.replace("_", " ")} services available at ${loc.name}.`,
                    })),
                },
            },
        });
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
