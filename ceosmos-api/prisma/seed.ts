import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'ras3ec@gmail.com';

  const user = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (user) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'ADMIN' },
    });
    console.log(`User ${adminEmail} promoted to ADMIN.`);
  } else {
    console.log(`User ${adminEmail} not found. Skipped.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
