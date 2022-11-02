import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// eslint-disable-next-line func-style
async function main() {

  await prisma.area.createMany({data: [
    {
      locationName: "Kaunas",
      northEastLat: 54.936803,
      northEastLong: 23.971769,
      southWestLat: 54.857355,
      southWestLong: 23.829046
    }
  ]});

  console.debug("seeding maps completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
