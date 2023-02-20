import { createRouter } from "./context";
import { campaignSchema } from "../../types/command/campaign.schema";
import { getByIdSchema } from "../../types/filters/getById.schema";
import { campaignBillboardsUpdate } from "../../types/command/campaignBillboardsUpdate";
import dateService from "../../services/dateService";

export const campaignRouter = createRouter()
  .mutation("create", {
    input: campaignSchema,
    async resolve({ ctx, input }) {
      const campaign = await ctx.prisma.campaign.create({
        data: {
          ...input,
        },
      });

      return { campaign };
    },
  })
  .mutation("updateBillboards", {
    input: campaignBillboardsUpdate,
    async resolve({ ctx, input }) {
      console.log("input", input);
      const campaign = await ctx.prisma.campaign.findFirst({
        where: { id: input.id },
      });

      if (input.sideIds.length !== campaign?.sideAmount) {
        throw new Error(
          "Selected side amount does not match side amount of campaign"
        );
      }

      await ctx.prisma.billboardSideInCampaign.deleteMany({
        where: { campaignId: input.id },
      });

      const newBillboardCampaignSides = input.sideIds.map((id) => ({
        campaignId: input.id,
        billboardSideId: id,
      }));

      await ctx.prisma.billboardSideInCampaign.createMany({
        data: newBillboardCampaignSides,
      });
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      const campaigns = await ctx.prisma.campaign.findMany({
        include: {
          customer: true,
        },
      });
      return campaigns;
    },
  })
  .query("getAllByCustomer", {
    async resolve({ ctx }) {
      const campaignDate = new Date();

      const customerCampaigns = await ctx.prisma.customer.findMany({
        include: {
          campaigns: {
            where: {
              periodEnd: {
                gte: campaignDate,
              },
            },
            include: {
              billboardSideInCampaigns: {
                include: {
                  billboardSide: true,
                },
              },
            },
          },
        },
      });

      const customersWithCampaigns = customerCampaigns.filter(
        (customer) => customer.campaigns.length > 0
      );

      return customersWithCampaigns;
    },
  })
  .query("getById", {
    input: getByIdSchema,
    async resolve({ ctx, input }) {
      const campaign = await ctx.prisma.campaign.findFirst({
        where: {
          id: input.id,
        },
      });

      return campaign;
    },
  });
