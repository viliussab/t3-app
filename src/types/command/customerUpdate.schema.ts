import z from "zod";

import { customerCreateSchema } from "./customerCreate.schema";

export const customerUpdateSchema = customerCreateSchema.extend({
  id: z.string()
});

export type CustomerUpdate = z.TypeOf<typeof customerUpdateSchema>
