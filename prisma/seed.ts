import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// eslint-disable-next-line func-style
async function main() {

  if (await prisma.area.count() === 0)
  {
    await prisma.area.createMany({data: [
      {
        locationName: "Kaunas",
        northEastLat: 54.936803,
        northEastLong: 23.971769,
        southWestLat: 54.857355,
        southWestLong: 23.829046
      }
    ]});
  }

  if (await prisma.billboardType.count() === 0)
  {
    await prisma.billboardType.createMany({data: [
      {
        name: "Stotelė"
      }
    ]});
  }

  console.debug("Seeding completed");
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
