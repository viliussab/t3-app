import z from "zod";

export const customerCreateSchema = z.object({
  name: z.string(),
  companyCode: z.string(),
  VATCode: z.string(),
  address: z.string(),
  phone: z.string(),
  contactPerson: z.string(),
  email: z.string().email(),
});

export type CustomerCreate = z.TypeOf<typeof customerCreateSchema>;
