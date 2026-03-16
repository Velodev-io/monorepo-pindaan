import { ENV } from "@pinddaan/config";
import { prisma } from "@pinddaan/db";

async function main() {
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users in DB.`);
    
    // For every user, promote to SUPER_ADMIN so any login works for this test
    for (const user of users) {
        await prisma.user.update({
            where: { id: user.id },
            data: { role: "SUPER_ADMIN", isActive: true }
        });
        console.log(`Promoted ${user.email} to SUPER_ADMIN.`);
    }
}

main().catch(console.error).finally(() => process.exit(0));
