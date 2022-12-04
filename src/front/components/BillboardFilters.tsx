import React from "react";
import { BillboardFilterObj } from "../../types/billboard.schema";
import Filters from "./filter";
import optionsService from "./../../services/options";
import { BooleanFilters } from "../../types/filters.schema";

type BillboardFiltersProps = {
    sideNames: Array<string>
    filters: BillboardFilterObj,
    onFilterChange: (fieldName: keyof BillboardFilterObj, value: BillboardFilterObj[keyof BillboardFilterObj]) => void
}

const BillboardFilters = (props : BillboardFiltersProps) => {

  console.log("filters", props.filters);

  const {sideNames, filters, onFilterChange} = props;

  return (

    <div className="flex " >


      <div className="w-64 pt-0 m-4 space-y-3">
        <Filters.Search
          label="Paieška"
          value={filters.search}
          onChange={(value) => onFilterChange("search", value)}
        />
      </div>
      <div className="w-64 pt-0 m-4 space-y-3">
        <Filters.MultiSelect 
          label="Sides"
          onChange={(values) => onFilterChange("allowedSides", values)}
          options={optionsService.convert({
            values: sideNames,
            extractKey: (value) => value,
            extractDisplayValue: (value) => value
          })}
          selectedKeys={filters.allowedSides}
        />
      </div>


      <Filters.SingleSelect
        label="ADsa"
        onChange={(value) => onFilterChange("license", value.key)}
        value={filters.license}
        options={
          optionsService.convert({
            values: Object.values(BooleanFilters),
            extractKey: (value) => value,
            extractDisplayValue: (value) => value
          })}
      />
      <Filters.SingleSelect
        label="ADsa"
        onChange={(value) => onFilterChange("illumination", value.key)}
        value={filters.illumination}
        options={
          optionsService.convert({
            values: Object.values(BooleanFilters),
            extractKey: (value) => value,
            extractDisplayValue: (value) => value
          })}
      />
    </div>
  );
};

export default BillboardFilters;
