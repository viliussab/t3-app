import { createRouter } from "./context";
import { mapCreateSchema } from "../../types/maps.schema";
import billboardService from "../domain/billboardService";

export const mapsRouter = createRouter()
  .mutation("create", {
    input: mapCreateSchema,
    async resolve({ ctx, input }) {
      const entity = await ctx.prisma.area.create({
        data: {...input}
      });
      await billboardService.populareAreaWithBillboardsAsync(ctx.prisma, entity);
  
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
