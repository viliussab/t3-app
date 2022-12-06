import { z } from "zod";

export enum BooleanFilters {
    True = "True",
    False = "False",
    Both = "True And False",
}

export const booleanFilterSchema = z.nativeEnum(BooleanFilters);

export type BooleanFilterEnum = z.infer<typeof booleanFilterSchema>;

