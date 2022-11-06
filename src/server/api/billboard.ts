import { createRouter } from "./context";
import { billboardCreateSchema, BillboardSelectedSideDto } from "../../types/billboard.schema";

export const billboardRouter = createRouter()
  .query("getAsSides", {
    async resolve({ ctx }) {
      const sides = await ctx.prisma.billboardSide.findMany({
        include: {
          billboard: true
        }
      });

      const billboardDto : Array<BillboardSelectedSideDto> = sides.map(side => ({
        ...side.billboard,
        sideName: side.name,
        fullName: side.billboard.name + " " + side.name
      }));
  
      return billboardDto;
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
