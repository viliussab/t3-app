import { createRouter } from "./context";
import { billboardCreateSchema, billboardFilterObjSchema } from "../../types/billboard.schema";
import prismaFactory from "../infrastructure/prismaFactory";

export const billboardRouter = createRouter()
  .query("getAll", {
    input: billboardFilterObjSchema || undefined,
    async resolve({ ctx, input }) {

      const queryResult = await ctx.prisma.billboard.findMany({
        include: {
          type: true,
          area: true,
          sides: !input.allowedSides.length ? true : {
            where: {
              name: {
                in: input.allowedSides
              }
            }
          }
        },
        where: {
          isLicensed: prismaFactory.buildBoolFilterWhereClause(input.license),
          isIlluminated: prismaFactory.buildBoolFilterWhereClause(input.illumination)
        }
      });

      if (!input.search) {
        return queryResult;
      }

      const getCaseInvariantWords = (str: string) => str.split(" ")
        .filter(keyword => keyword !== "")
        .map(keyword => keyword.toLocaleLowerCase());

      const searchKeywords = getCaseInvariantWords(input.search);

      const isInSearch = (field: string | undefined) => {
        if (!field) {
          return false;
        }

        const fieldWords = getCaseInvariantWords(field);

        if (fieldWords.length < searchKeywords.length) {
          return false;
        }

        if (searchKeywords.length === 1) {
          const firstKeyword = [...searchKeywords].shift() || "";

          return fieldWords.some(fieldWord => fieldWord.includes(firstKeyword));
        }

        const first = [...searchKeywords].shift() || "";
        const last = [...searchKeywords].pop() || "";
        const inBetween = [...searchKeywords].slice(1).slice(-1);

        return fieldWords.some(fieldKeyWord => fieldKeyWord.endsWith(first))
          && fieldWords.some(fieldKeyWord => fieldKeyWord.startsWith(last))
          && (
            inBetween.length
            && inBetween.every((searchKeyword, i) => searchKeyword === fieldWords[i + 1])
          );
      };

      const searchFilteredBillboards = queryResult.filter(billboard => 
        isInSearch(billboard.address)
        || isInSearch(billboard.name)
        || isInSearch(billboard.area.locationName)
        || isInSearch(billboard.type.name)
      );
  
      return searchFilteredBillboards;
    }
  })
  .query("getDistinctSideNames", {
    async resolve({ ctx }) {

      const sides = await ctx.prisma.billboardSide.findMany({
        where: {},
        distinct: ["name"]
      });

      const distinctNames = sides.map(side => side.name);
      
      return distinctNames;
    }
  })
  .mutation("create", {
    input: billboardCreateSchema,
    async resolve({ ctx, input }) {

      const billboard = await ctx.prisma.billboard.create({
        data: {
          longitude: input.longitude,
          latitude: input.latitude,
          address: input.address,
          name: input.name,
          serialCode: input.serialCode,
          isIlluminated: input.isIlluminated,
          isLicensed: input.isLicensed,
          typeId: input.typeId,
          areaId: input.areaId
        }
      });
      const side = await ctx.prisma.billboardSide.create({
        data: {
          billboardId: billboard.id,
          name: input.sideName
        }
      });
  
      return { billboard, side };
    }
  });
