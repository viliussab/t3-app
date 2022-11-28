import React from "react";
import { BillboardFilterObj } from "../../types/billboard.schema";
import Filters from "./filter";

type BillboardFiltersProps = {
    sideNames: Array<string>
    filters: BillboardFilterObj,
    onFilterChange: (fieldName: keyof BillboardFilterObj, value: BillboardFilterObj[keyof BillboardFilterObj]) => void
}

const BillboardFilters = (props : BillboardFiltersProps) => {

  const {sideNames, filters, onFilterChange} = props;

  return (
    <>
      <Filters.Search
        label="dasdas"
        value={filters.search}
        onChange={(value) => onFilterChange("search", value)}
      />
    </>
  );
};

export default BillboardFilters;
