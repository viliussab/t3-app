import { Billboard, BillboardSide } from "@prisma/client";
import React from "react";
import { BillboardFilterObj } from "../../types/billboard.schema";

type BillboardFiltersProps = {
    sideNames: Array<string>
    filters: BillboardFilterObj,
    onFilterChange: (fieldName: keyof BillboardFilterObj, value: BillboardFilterObj[keyof BillboardFilterObj]) => void
}

const BillboardFilters = (props : BillboardFiltersProps) => {

  const {sideNames, filters, onFilterChange} = props;

  return (
    <>

    </>
  );
};

export default BillboardFilters;
