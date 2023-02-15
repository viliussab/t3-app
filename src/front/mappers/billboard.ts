import {
  BillboardDto,
  BillboardUniqueSideDto,
} from "../../types/dto/BillboardDtos";

const toUniqueSides = (billboards: BillboardDto[] | undefined) => {
  if (!billboards) {
    return [];
  }

  const sideDistinctBillboards = billboards
    ?.map((billboard) =>
      billboard.sides.map((side) => ({
        ...billboard,
        side,
      }))
    )
    .flat();

  return sideDistinctBillboards as BillboardUniqueSideDto[];
};

const billboardMapper = {
  toUniqueSides,
};

export default billboardMapper;
