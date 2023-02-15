import { Prisma } from "@prisma/client";
import {
  BooleanFilterEnum,
  BooleanFilters,
} from "../../types/filters/booleanFilter.schema";

const buildBoolFilterWhereClause = (boolFilter: BooleanFilterEnum) => {
  if (boolFilter === BooleanFilters.False) {
    return { equals: false };
  }
  if (boolFilter === BooleanFilters.True) {
    return { equals: true };
  }

  return undefined;
};

const buildSearchFilter = (searchKeyword: string, mode: Prisma.QueryMode) => {
  if (!searchKeyword) {
    return undefined;
  }

  const searchField = {
    search: searchKeyword.split(" ").join(" & "),
    mode: mode,
  } as Prisma.StringFilter;

  return searchField;
};

const prismaFactory = {
  buildBoolFilterWhereClause,
  buildSearchFilter,
};

export default prismaFactory;
