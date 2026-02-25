const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const LOCATIONS = [
    { name: "Gaya", state: "Bihar", image: "/images/gaya_vishnupad_temple_1771776066448.png", services: ["PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Varanasi", state: "UP", image: "/images/kashi_ghats_1771776018344.png", services: ["ASTHI_VISARJAN", "PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Haridwar", state: "Uttarakhand", image: "/images/haridwar_landing_1771776044242.png", services: ["ASTHI_VISARJAN", "PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Prayagraj", state: "UP", image: "/images/triveni_sangam_hero_1771775992808.png", services: ["ASTHI_VISARJAN", "PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Kurukshetra", state: "Haryana", image: "/images/kurukshetra.png", services: ["PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Siddhpur", state: "Gujarat", image: "/images/siddhpur.png", services: ["PIND_DAAN", "SHRADDH"] },
    { name: "Nashik", state: "Maharashtra", image: "/images/nashik.png", services: ["ASTHI_VISARJAN", "PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Pushkar", state: "Rajasthan", image: "/images/pushkar.png", services: ["PIND_DAAN", "SHRADDH", "TARPAN"] },
    { name: "Somnath", state: "Gujarat", image: "/images/somnath.png", services: ["ASTHI_VISARJAN", "PIND_DAAN"] },
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
                image: loc.image,
                isActive: true,
            },
            create: {
                name: loc.name,
                state: loc.state,
                slug,
                image: loc.image,
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
