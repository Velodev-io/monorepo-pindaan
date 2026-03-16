const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: "Sacred Gangajal", sku: "GJ-250", volumeMl: 250, price: 12.99, isActive: true },
    { name: "Standard Vessel", sku: "GJ-500", volumeMl: 500, price: 19.99, isActive: true },
    { name: "Devotional Volume", sku: "GJ-1000", volumeMl: 1000, price: 34.99, isActive: true },
    { name: "Akhanda Ritual", sku: "GJ-5000", volumeMl: 5000, price: 149.99, isActive: false }
  ];

  for (const p of products) {
      await prisma.product.upsert({
          where: { sku: p.sku },
          update: {},
          create: p
      });
  }
  console.log("Database seeded with products.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
