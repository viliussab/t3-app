import { customerCreateSchema } from "../../types/command/customerCreate.schema";
import { customerUpdateSchema } from "../../types/command/customerUpdate.schema";
import { getByIdSchema } from "../../types/filters/getById.schema";
import { createRouter } from "./context";

export const customerRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const customers = await ctx.prisma.customer.findMany();

      return customers;
    },
  })
  .query("getById", {
    input: getByIdSchema,
    async resolve({ ctx, input }) {
      const customer = await ctx.prisma.customer.findFirst({
        where: { id: input.id },
      });

      return customer;
    },
  })
  .mutation("create", {
    input: customerCreateSchema,
    async resolve({ ctx, input }) {
      const customer = await ctx.prisma.customer.create({
        data: {
          ...input,
        },
      });

      return customer;
    },
  })
  .mutation("update", {
    input: customerUpdateSchema,
    async resolve({ ctx, input }) {
      const customer = await ctx.prisma.customer.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });

      return customer;
    },
  });
