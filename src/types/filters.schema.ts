import { z } from "zod";

export const booleanFilter = z.enum(["True", "False", "True And False"]);

export type BooleanFilter = z.infer<typeof booleanFilter>;
