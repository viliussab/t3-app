import z from "zod";

export const campaignCreateSchema = z.object({
  customerId: z.string().min(1, "Pasirinkite užsakovą"),
  campaignName: z.string().min(1, "Kampanijos pavadinimas yra būtinas"),
  periodStart: z.date(),
  periodEnd: z.date(),
  selectedBillboardIds: z.array(
    z.string()
  )
});

export type CampaignCreate = z.TypeOf<typeof campaignCreateSchema>
