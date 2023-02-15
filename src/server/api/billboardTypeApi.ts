import { createRouter } from "./context";

export const billboardTypesRouter = createRouter().query("getAll", {
  async resolve({ ctx }) {
    const types = await ctx.prisma.billboardType.findMany();

    return types;
  },
});
