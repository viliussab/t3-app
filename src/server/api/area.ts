import { createRouter } from "./context";
import { areaCreateSchema } from "../../types/command/areaCreate.schema";

export const mapsRouter = createRouter()
  .mutation("create", {
    input: areaCreateSchema,
    async resolve({ ctx, input }) {
      const entity = await ctx.prisma.area.create({
        data: { ...input },
      });

      return {
        id: entity.id,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      const maps = await ctx.prisma.area.findMany();

      return maps;
    },
  });
