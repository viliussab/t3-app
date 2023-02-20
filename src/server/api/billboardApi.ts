import { createRouter } from "./context";
import { billboardSchema } from "../../types/command/billboard.schema";
import { billboardFilterObjSchema } from "../../types/filters/billboardFilter.schema";
import prismaFactory from "../infrastructure/prismaFactory";
import { billboardSideIds } from "../../types/filters/billboardSideIds.schema";
import billboardMapper from "../../front/mappers/billboard";
import { BooleanFilters } from "../../types/filters/booleanFilter.schema";

const getCaseInvariantWords = (str: string) =>
  str
    .split(" ")
    .filter((keyword) => keyword !== "")
    .map((keyword) => keyword.toLocaleLowerCase());

const fullfillsSearch = (
  text: string | undefined,
  searchKeywords: string[]
) => {
  if (!text) {
    return false;
  }

  const words = getCaseInvariantWords(text);

  if (words.length < searchKeywords.length) {
    return false;
  }

  if (searchKeywords.length === 1) {
    const firstKeyword = [...searchKeywords].shift() || "";

    return words.some((fieldWord) => fieldWord.includes(firstKeyword));
  }

  const first = [...searchKeywords].shift() || "";
  const last = [...searchKeywords].pop() || "";
  const inBetween = [...searchKeywords].slice(1, searchKeywords.length - 1);

  return (
    words.some(
      (fieldKeyWord) =>
        fieldKeyWord.startsWith(first) || fieldKeyWord.endsWith(first)
    ) &&
    words.some(
      (fieldKeyWord) =>
        fieldKeyWord.startsWith(last) || fieldKeyWord.endsWith(last)
    ) &&
    inBetween.every((searchWord) =>
      words.some((fieldWord) => fieldWord === searchWord)
    )
  );
};

export const billboardRouter = createRouter()
  .query("getFiltered", {
    input: billboardFilterObjSchema,
    async resolve({ ctx, input }) {
      const queryResult = await ctx.prisma.billboard.findMany({
        include: {
          type: true,
          area: true,
          sides: !input.allowedSides.length
            ? true
            : {
                where: {
                  sideType: {
                    in: input.allowedSides,
                  },
                },
              },
        },
        where: {
          isLicensed: prismaFactory.buildBoolFilterWhereClause(input.license),
          isIlluminated: prismaFactory.buildBoolFilterWhereClause(
            input.illumination
          ),
        },
      });

      const billboardWithSides = queryResult.filter(
        (billboard) => billboard.sides.length > 0
      );

      const getCaseInvariantWords = (str: string) =>
        str
          .split(" ")
          .filter((keyword) => keyword !== "")
          .map((keyword) => keyword.toLocaleLowerCase());

      const searchKeywords = getCaseInvariantWords(input.search);

      if (!searchKeywords.length) {
        return billboardWithSides;
      }

      const searchFilteredBillboards = billboardWithSides.filter(
        (billboard) => {
          const searchFields = [
            billboard.address,
            billboard.sides.map((s) => s.title),
            billboard.area.locationName,
            billboard.type.name,
            billboard.serialCode,
            billboard.sides.map((s) => s.sideType).join(" "),
          ];

          const text = searchFields.join(" ");

          return fullfillsSearch(text, searchKeywords);
        }
      );

      return searchFilteredBillboards;
    },
  })
  .query("getSideOccupancy", {
    input: billboardFilterObjSchema,
    async resolve({ ctx, input }) {
      const queryResult = await ctx.prisma.billboardSide.findMany({
        include: {
          billboard: {
            include: {
              area: true,
              type: true,
            },
          },
          billboardSideInCampaigns: {
            include: {
              campaign: {
                include: {
                  customer: true,
                },
              },
            },
          },
        },
        where: {
          sideType: {
            in: input.allowedSides,
          },
        },
      });

      const searchKeywords = getCaseInvariantWords(input.search);

      if (!searchKeywords.length) {
        return queryResult;
      }

      const searchFilteredSides = queryResult.filter((side) => {
        const searchFields = [
          side.billboard.address,
          side.title,
          side.billboard.area.locationName,
          side.billboard.type.name,
          side.billboard.serialCode,
          side.sideType,
        ];

        const text = searchFields.join(" ");

        return fullfillsSearch(text, searchKeywords);
      });

      return searchFilteredSides;
    },
  })
  .query("getBySideIds", {
    input: billboardSideIds,
    async resolve({ ctx, input }) {
      const queryResult = await ctx.prisma.billboard.findMany({
        include: {
          type: true,
          area: true,
          sides: {
            where: { id: { in: input.sideIds } },
          },
        },
      });

      const billboardWithSides = queryResult.filter(
        (billboard) => billboard.sides.length > 0
      );

      const billboardUniqueSides =
        billboardMapper.toUniqueSides(billboardWithSides);

      return billboardUniqueSides;
    },
  })
  .query("getDistinctSideTypes", {
    async resolve({ ctx }) {
      const sides = await ctx.prisma.billboardSide.findMany({
        where: {},
        distinct: ["sideType"],
      });

      const distinctNames = sides.map((side) => side.sideType);

      return distinctNames;
    },
  })
  .mutation("create", {
    input: billboardSchema,
    async resolve({ ctx, input }) {
      const billboard = await ctx.prisma.billboard.create({
        data: {
          longitude: input.longitude,
          latitude: input.latitude,
          address: input.address,
          serialCode: input.serialCode,
          isIlluminated: input.isIlluminated,
          isLicensed: input.isLicensed,
          typeId: input.typeId,
          areaId: input.areaId,
        },
      });
      const side = await ctx.prisma.billboardSide.create({
        data: {
          billboardId: billboard.id,
          sideType: input.sideName,
          title: input.name,
        },
      });

      return { billboard, side };
    },
  });
