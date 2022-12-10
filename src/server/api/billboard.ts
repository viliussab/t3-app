import { createRouter } from "./context";
import { billboardCreateSchema } from "../../types/command/billboard.schema";
import { billboardFilterObjSchema } from "../../types/filters/billboardFilter.schema";
import prismaFactory from "../infrastructure/prismaFactory";

export const billboardRouter = createRouter()
  .query("getAll", {
    input: billboardFilterObjSchema,
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

      const billboardWithSides = queryResult.filter(billboard => billboard.sides.length > 0);

      const getCaseInvariantWords = (str: string) => str.split(" ")
        .filter(keyword => keyword !== "")
        .map(keyword => keyword.toLocaleLowerCase());

      const searchKeywords = getCaseInvariantWords(input.search);

      if (!searchKeywords.length) {
        return billboardWithSides;
      }

      const fullfillsSearch = (text: string | undefined) => {
        if (!text) {
          return false;
        }

        const words = getCaseInvariantWords(text);

        if (words.length < searchKeywords.length) {
          return false;
        }

        if (searchKeywords.length === 1) {
          const firstKeyword = [...searchKeywords].shift() || "";

          return words.some(fieldWord => fieldWord.includes(firstKeyword));
        }

        const first = [...searchKeywords].shift() || "";
        const last = [...searchKeywords].pop() || "";
        const inBetween = [...searchKeywords].slice(1, searchKeywords.length - 1);

        return words.some(fieldKeyWord => fieldKeyWord.startsWith(first) || fieldKeyWord.endsWith(first))
          && words.some(fieldKeyWord => fieldKeyWord.startsWith(last) || fieldKeyWord.endsWith(last))
          && inBetween.every((searchWord) => 
            words.some((fieldWord) => fieldWord === searchWord
            )
          );
      };

      const searchFilteredBillboards = billboardWithSides.filter(billboard => {
        const searchFields = [
          billboard.address,
          billboard.name,
          billboard.area.locationName,
          billboard.type.name,
          billboard.serialCode,
          billboard.sides.map(s => s.name).join(" ")
        ];

        const text = searchFields.join(" ");

        return fullfillsSearch(text);
      });
  
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
