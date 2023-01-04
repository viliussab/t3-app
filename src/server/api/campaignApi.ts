import { createRouter } from "./context";
import { campaignCreateSchema } from "../../types/command/campaignCreate.schema";
import { getByIdSchema } from "../../types/filters/getById.schema";

export const campaignRouter = createRouter()

  .mutation("create", {
    input: campaignCreateSchema,
    async resolve({ ctx, input }) {
      const campaign = await ctx.prisma.campaign.create({
        data: {
          ...input
        }
      });
  
      return { campaign };
    }
  })
  .query("getAll", {
    async resolve({ctx}) {
      const campaigns = await ctx.prisma.campaign.findMany({
        include: {
          customer: true
        }
      });

      return campaigns;
    }
  })
  .query("getById", {
    input: getByIdSchema,
    async resolve({ctx, input}) {
      const campaign = await ctx.prisma.campaign.findFirst({
        where: {
          id: input.id
        }
      });

      return campaign;
    }
  });
