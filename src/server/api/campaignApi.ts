import { createRouter } from "./context";
import { campaignCreateSchema } from "../../types/command/campaignCreate.schema";
import { getByIdSchema } from "../../types/filters/getById.schema";
import { campaignSelectBillboardsSchema } from "../../types/command/campaignSelectBillboards.schema";

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
  .mutation("updateBillboards", {
    input: campaignSelectBillboardsSchema,
    async resolve({ctx, input}) {

      console.log('input', input);
      const campaign = await ctx.prisma.campaign.findFirst({ where: {id: input.id}})

      if (input.sideIds.length !== campaign?.sideAmount) {
        throw new Error("Selected side amount does not match side amount of campaign")
      }

      await ctx.prisma.billboardSideInCampaign.deleteMany({where: {campaignId: input.id}});

      const newBillboardCampaignSides = input.sideIds.map(id => ({
        campaignId: input.id,
        billboardSideId: id, 
      }))

      await ctx.prisma.billboardSideInCampaign.createMany({data: newBillboardCampaignSides});
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
