import z from "zod";

export const campaignBillboardsUpdate = z.object({
  sideIds: z.array(z.string()),
  id: z.string(),
});

export type CampaignBillboardsUpdate = z.TypeOf<
  typeof campaignBillboardsUpdate
>;
