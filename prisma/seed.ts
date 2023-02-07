/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PrismaClient } from "@prisma/client";
import arrayService from "../src/services/array";
import stopsReader from "./seeds/stopsReader";
import demoSeeder from './seeds/demoSeeder';

const prisma = new PrismaClient();

async function main() {

  await deleteDatabaseAsync();

  if (await prisma.area.count() === 0) {
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

  if (await prisma.billboardType.count() === 0) {
    await prisma.billboardType.createMany({data: [
      {
        name: "Stotelė"
      }
    ]});
  }

  if (await prisma.billboard.count() === 0) {
    await seedBillboardsAsync();
  }

  await demoSeeder.seedAsync(prisma);
}

async function seedBillboardsAsync() {
  const billboards = await stopsReader.readAsync();

  if (!billboards) {
    return;
  }

  const serialCodes = billboards.map(billboard => billboard.serialCode).filter(arrayService.isUnique);

  serialCodes.forEach(async (code) => {
    const billboardsByCode = billboards.filter(b => b.serialCode === code);

    const billboardRequest = billboardsByCode[0] ?? throwExpression("billboard null");
    const area = await prisma.area.findFirst() ?? throwExpression("area null");
    const type = await prisma.billboardType.findFirst() ?? throwExpression("type null");

    const billboard = await prisma.billboard.create({data: 
      {
        address: billboardRequest.address,
        isIlluminated: true,
        isLicensed: true,
        areaId: area.id,
        latitude: billboardRequest.latitude,
        longitude: billboardRequest.longitude,
        serialCode: billboardRequest.serialCode,
        typeId: type.id
      }
    });

    await prisma.billboardSide.createMany({
      data: billboardsByCode.map(b => ({
        billboardId: billboard.id,
        sideType: b.side,
        title: b.name,
        googlePhotoUrl: b.googlePhotoUrl
      }))
    });
  });
}

const deleteDatabaseAsync = async () => {
  await prisma.area.deleteMany();
  await prisma.billboardType.deleteMany();
  await prisma.billboard.deleteMany();
  await prisma.billboardSide.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.billboardSideInCampaign.deleteMany();
}

function throwExpression(errorMessage: string): never {
  throw new Error(errorMessage);
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
