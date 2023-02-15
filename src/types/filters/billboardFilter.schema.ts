import { z } from "zod";
import { booleanFilterSchema } from "./booleanFilter.schema";

export const billboardFilterObjSchema = z.object({
  search: z.string(),
  allowedSides: z.array(z.string()),
  illumination: booleanFilterSchema,
  license: booleanFilterSchema,
});

export type BillboardFilterObj = z.TypeOf<typeof billboardFilterObjSchema>;
