import z from "zod";

export const campaignSchema = z.object({
  customerId: z.string().min(1, "Pasirinkite užsakovą"),
  name: z.string().min(1, "Kampanijos pavadinimas yra būtinas"),
  periodStart: z.date(),
  periodEnd: z.date(),
  sideAmount: z.number(),
  requiresPrinting: z.boolean(),
  discountPercent: z.number().min(0).max(99),
});

export type CampaignCU = z.TypeOf<typeof campaignSchema>;
