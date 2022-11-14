import { createRouter } from "./context";
import { campaignCreateSchema } from "./../../types/campaign.schema";

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
  });
