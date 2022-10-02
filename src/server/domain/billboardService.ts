import {Area, Billboard, AreaBillboard} from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const populareAreaWithBillboardsAsync = async (
  prisma: PrismaClient,
  area: Area) => {

  const billboards = await prisma.billboard.findMany();

  const billboardsInArea = billboards.filter(billboard => isBillboardInArea(area, billboard));

  const areaBillboards: AreaBillboard[] =
    billboardsInArea.map(b => ({ billboardId: b.id, areaId: area.id }));

  await prisma.areaBillboard.createMany({data: [...areaBillboards]});
};

const isBillboardInArea = (area: Area, billboard: Billboard) => ( 
  area.northWestCorner_latitude >= billboard.latitude
    && area.northWestCorner_longitude <= billboard.longitude

    && area.southEastCorner_latitude <= billboard.latitude
    && area.southEastCorner_longitude >= billboard.longitude  
);

const billboardService = {
  populareAreaWithBillboardsAsync
};

export default billboardService;
