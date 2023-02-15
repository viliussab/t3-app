import z from "zod";

export const areaCreateSchema = z.object({
  locationName: z.string(),

  northEastLat: z.number().gte(-90).lte(90),
  northEastLong: z.number().gte(-180).lte(180),

  southWestLat: z.number().gte(-90).lte(90),
  southWestLong: z.number().gte(-180).lte(180),
});

export type AreaCreate = z.TypeOf<typeof areaCreateSchema>;
