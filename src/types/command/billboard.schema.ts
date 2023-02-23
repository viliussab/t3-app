import z from "zod";
import messages from "../../services/validateMessage";

export const billboardSchema = z.object({
  areaId: z.string().min(1, "Pasirinkite miestą"),
  typeId: z.string().min(1, "Pasirinkite tipą"),
  serialCode: z.string().min(1, "Kodas yra būtinas"),

  latitude: z
    .number(messages.numParams("Plokštuma"))
    .gte(-90, messages.num.gte("Plokštuma", -90))
    .lte(90, messages.num.lte("Plokštuma", 90)),

  longitude: z
    .number(messages.numParams("Ilguma"))
    .gte(-180, messages.num.lte("Ilguma", -180))
    .lte(180, messages.num.lte("Ilguma", 180)),

  address: z.string().min(1, "Adresas yra būtinas"),
  // name: z.string().min(1, "Pavadinimas yra būtinas"),
  // sideName: z.string().min(1, "Pusė yra būtina"),

  isIlluminated: z.boolean(),
  isLicensed: z.boolean(),
});

export const billboardUpdateSchema = billboardSchema.extend({
  id: z.string(),
});

export type BillboardCU = z.TypeOf<typeof billboardSchema>;

export type BillboardUpdate = z.TypeOf<typeof billboardUpdateSchema>;
