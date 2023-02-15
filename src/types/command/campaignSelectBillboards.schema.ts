import z from "zod";

export const campaignSelectBillboardsSchema = z.object({
  sideIds: z.array(z.string()),
  id: z.string(),
});

export type CampaignBillboardSelect = z.TypeOf<
  typeof campaignSelectBillboardsSchema
>;
