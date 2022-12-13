import z from "zod";

export const customerUpdateSchema = z.object({
  id: z.string(),

  name: z.string(),

  companyCode: z.string(),
  VATCode: z.string(),
  address: z.string(),
  phone: z.string(),
  contactPerson: z.string(),
  email: z.string().email()
});

export type CustomerUpdate = z.TypeOf<typeof customerUpdateSchema>
