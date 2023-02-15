import { z } from "zod";

export const billboardSideIds = z.object({
  sideIds: z.array(z.string()),
});
