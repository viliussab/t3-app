import { createRouter } from "./context";
import { areaCreateSchema } from "../../types/area.schema";
import billboardService from "../s-services/billboardService";

export const mapsRouter = createRouter()
  .mutation("create", {
    input: areaCreateSchema,
    async resolve({ ctx, input }) {
      const entity = await ctx.prisma.area.create({
        data: {...input}
      });
      await billboardService.populateAreaWithBillboardsAsync(ctx.prisma, entity);
  
      return {
        id: entity.id
      };
    }
  })
  .query("getAll", {
    async resolve({ ctx }) {
      const maps = await ctx.prisma.area.findMany();

      return maps;
    }
  });
