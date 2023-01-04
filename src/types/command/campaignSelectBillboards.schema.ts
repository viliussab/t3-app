import z from "zod";

export const campaignSelectBillboardsSchema = z.object({
  ids: z.array(z.string())
});

export type CampaignBillboardSelect = z.TypeOf<typeof campaignSelectBillboardsSchema>;
