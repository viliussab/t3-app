import z from "zod";

import { CustomerCreate, customerCreateSchema } from "./customerCreate.schema";

export const customerUpdateSchema = customerCreateSchema.extend({
  id: z.string(),
});

export type CustomerUpdate = CustomerCreate & {
  id: string;
};
