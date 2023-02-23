import { BillboardSide } from "@prisma/client";
import z from "zod";

export const billboardSideUpdateSchema = z.object({
  id: z.string(),
  sideType: z.string(),
  title: z.string(),
  googlePhotoUrl: z.string().nullish(),
});

export type BillboardSideUpdate = z.TypeOf<typeof billboardSideUpdateSchema>;
