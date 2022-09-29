import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from './../db/client';
import { mapCreateSchema } from './../../types/maps.schema';

export const mapsRouter = createRouter()
  .mutation("create", {
    input: mapCreateSchema,
    async resolve({ ctx, input }) {

      const entity = await ctx.prisma.map.create({
        data: {...input}
      });
  
      return {
        id: entity.id
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.map.findMany();
    },
  });
