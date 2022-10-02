import z from "zod";

export const mapCreateSchema = z.object({
  locationName: z.string(),

  northWestCorner_latitude: z.number().gte(-90).lte(90),
  northWestCorner_longitude: z.number().gte(-180).lte(180),

  southEastCorner_latitude: z.number().gte(-90).lte(90),
  southEastCorner_longitude: z.number().gte(-180).lte(180)
});

export type MapCreate = z.TypeOf<typeof mapCreateSchema>
