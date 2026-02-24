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

const SERVICES = ["ASTHI_VISARJAN", "PIND_DAAN", "SHRADDH", "TARPAN"];

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
    console.log("Seeding new location mapping system...");

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
                    create: SERVICES.map((service, index) => ({
                        service,
                        isPrimary: service === "PIND_DAAN", // Default PIND_DAAN as primary
                        notes: `Traditional ${service.replace('_', ' ')} services available at ${loc.name}.`,
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
