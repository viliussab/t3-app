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
    },
    {
      locationName: "Vilnius",
      northEastLat: 54.758262,
      northEastLong: 25.461232,
      southWestLat: 54.591752,
      southWestLong: 24.947621
    },
    {
      locationName: "Klaipėda",
      northEastLat: 55.648722,
      northEastLong: 21.002694,
      southWestLat: 55.610573,
      southWestLong: 20.991670
    }
  ]});

  console.log("seeding completed", await prisma.area.findMany());
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
