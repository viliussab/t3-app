/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PrismaClient } from "@prisma/client";
import arrayService from "../src/services/array";
import stopsReader from "./seeds/stopsReader";

const prisma = new PrismaClient();

// eslint-disable-next-line func-style
function throwExpression(errorMessage: string): never {
  throw new Error(errorMessage);
}

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

  if (await prisma.billboard.count() === 0)
  {
    const billboards = await stopsReader.readAsync();

    if (!billboards) {
      return;
    }

    const serialCodes = billboards.map(billboard => billboard.serialCode).filter(arrayService.isUnique);

    serialCodes.forEach(async (code) => {
      const billboardsByCode = billboards.filter(b => b.serialCode === code);

      const billboardProto = billboardsByCode[0] ?? throwExpression("billboard null");
      const area = await prisma.area.findFirst() ?? throwExpression("area null");
      const type = await prisma.billboardType.findFirst() ?? throwExpression("type null");

      const billboard = await prisma.billboard.create({data: 
        {
          address: billboardProto.address,
          isIlluminated: true,
          isLicensed: true,
          areaId: area.id,
          latitude: billboardProto.latitude,
          longitude: billboardProto.longitude,
          serialCode: billboardProto.serialCode,
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
