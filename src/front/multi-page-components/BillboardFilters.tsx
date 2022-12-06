import React from "react";
import { BillboardFilterObj } from "../../types/filters/billboardFilter.schema";
import Filters from "../components/filter";
import optionsService from "../../services/options";
import { BooleanFilters } from "../../types/filters/booleanFilter.schema";

type BillboardFiltersProps = {
    sideNames: Array<string>
    filters: BillboardFilterObj,
    onFilterChange: (fieldName: keyof BillboardFilterObj, value: BillboardFilterObj[keyof BillboardFilterObj]) => void
}

const BillboardFilters = (props : BillboardFiltersProps) => {
  const {sideNames, filters, onFilterChange} = props;

  return (
    <div className="flex gap-2">
      <div className="w-64">
        <Filters.Search
          label="Paieška"
          value={filters.search}
          onChange={(value) => onFilterChange("search", value)}
        />
      </div>
      <div className="w-64">
        <Filters.MultiSelect 
          label="Pusė"
          onChange={(values) => onFilterChange("allowedSides", values)}
          options={optionsService.convert({
            values: sideNames,
            extractKey: (value) => value,
            extractDisplayValue: (value) => value
          })}
          selectedKeys={filters.allowedSides}
        />
      </div>
      <div className="w-64">
        <Filters.SingleSelect
          label="Licenzija"
          onChange={(value) => onFilterChange("license", value.key)}
          value={filters.license}
          options={
            optionsService.convert({
              values: Object.values(BooleanFilters),
              extractKey: (value) => value,
              extractDisplayValue: (value) => value
            })}
        />
      </div>
      <div className="w-64">
        <Filters.SingleSelect
          label="Apšvietimas"
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
    </div>
  );
};

export default BillboardFilters;
