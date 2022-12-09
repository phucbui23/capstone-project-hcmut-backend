import { PrismaClient } from '@prisma/client';
import res from './sample_medication.json';

//Map the data to data array to be used in createMany
const data = res.drugbank.drug.map((drug) => ({
  code : drug['drugbank-id'][0],
  name : drug.name,
  description : drug.description,
}));

const prisma = new PrismaClient();

async function main() {
  await prisma.medication.createMany({
    data,
    skipDuplicates: true, // Skip duplicate entries
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
