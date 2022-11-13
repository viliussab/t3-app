import { createRouter } from "./context";

export const customerRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const customers = await ctx.prisma.customer.findMany();

      return customers;
    }
  });
