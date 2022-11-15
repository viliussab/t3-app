import { Billboard, BillboardSide } from "@prisma/client";
import React from "react";
import { BillboardFiltersDto } from "../../types/billboard.schema";

type BillboardFiltersProps = {
    sideNames: Array<string>
    filters: BillboardFiltersDto,
    onFilterChange: (fieldName: keyof BillboardFiltersDto, value: BillboardFiltersDto[keyof BillboardFiltersDto]) => void
}

const BillboardFilters = (props : BillboardFiltersProps) => {

  const {sideNames, filters, onFilterChange} = props;

  return (
    <>

    </>
  );
};

export default BillboardFiltersDto;
