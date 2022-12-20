import { z } from "zod";

export const customerById = z.object({
  id: z.string()
});
  
