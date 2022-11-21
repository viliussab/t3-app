import { createRouter } from "./context";
import { billboardCreateSchema } from "../../types/billboard.schema";

export const billboardRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {

      const billboards = await ctx.prisma.billboard.findMany({
        include: {
          type: true,
          area: true,
          sides: true
        }
      });
  
      return billboards;
    }
  })
  .query("getDistinctSideNames", {
    async resolve({ ctx }) {

      const sides = await ctx.prisma.billboardSide.findMany({
        where: {},
        distinct: ["name"]
      });

      const distinctNames = sides.map(side => side.name);
      
      return distinctNames;
    }
  })
  .mutation("create", {
    input: billboardCreateSchema,
    async resolve({ ctx, input }) {

      const billboard = await ctx.prisma.billboard.create({
        data: {
          longitude: input.longitude,
          latitude: input.latitude,
          name: input.name,
          serialCode: input.serialCode,
          isIlluminated: input.isIlluminated,
          isLicensed: input.isLicensed,
          address: input.address,
            
          typeId: input.typeId,
          areaId: input.areaId
        }
      });

      const side = await ctx.prisma.billboardSide.create({
        data: {
          billboardId: billboard.id,
          name: input.sideName
        }
      });
  
      return { billboard, side };
    }
  });
