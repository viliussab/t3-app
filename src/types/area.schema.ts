import z from "zod";

export const areaCreateSchema = z.object({
  locationName: z.string(),

  northWestCorner_latitude: z.number().gte(-90).lte(90),
  northWestCorner_longitude: z.number().gte(-180).lte(180),

  southEastCorner_latitude: z.number().gte(-90).lte(90),
  southEastCorner_longitude: z.number().gte(-180).lte(180)
});

export type AreaCreate = z.TypeOf<typeof areaCreateSchema>
