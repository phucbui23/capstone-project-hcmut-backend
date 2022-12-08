import { PrismaClient } from '@prisma/client';

import { RESOURCES, resources } from './seed-data/resources';
import { roles } from './seed-data/roles';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.deleteMany();

  await prisma.resource.deleteMany();

  await prisma.resource.createMany({
    data: resources,
  });

  await prisma.role.createMany({
    data: roles,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
