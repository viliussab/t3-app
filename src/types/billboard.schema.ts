import z from "zod";
import messages from "../services/validateMessage";

export const billboardCreateSchema = z.object({
  areaId: z.string(),

  latitude: z.number(messages.numParams("Plokštuma"))
    .gte(-90, messages.num.gte("Plokštuma", -90))
    .lte(90, messages.num.lte("Plokštuma", 90)),

  longitude: z.number(messages.numParams("Ilguma"))
    .gte(-180, messages.num.lte("Ilguma", -180))
    .lte(180, messages.num.lte("Ilguma", 180))
});

export type BillboardCreate = z.TypeOf<typeof billboardCreateSchema>
