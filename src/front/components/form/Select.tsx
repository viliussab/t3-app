import React from "react";
import * as RHC from "react-hook-form";
import * as Mui from "@mui/material";
import { SelectOption } from "../../../types/props/selectOption.schema";

type SelectProps<T extends RHC.FieldValues> = {
  fieldName: RHC.Path<T>;
  form: RHC.UseFormReturn<T>;
  label: string;
  options: SelectOption[];
};

const Select = <T extends RHC.FieldValues>(props: SelectProps<T>) => {
  const { fieldName, form, options, label } = props;

  const value = form.watch(fieldName);

  console.log("value", fieldName, value);

  return (
    <Mui.FormControl variant="filled" fullWidth>
      <Mui.InputLabel id="select-standard-label">{label}</Mui.InputLabel>
      <Mui.Select
        fullWidth
        required
        labelId="select-standard-label"
        id="select-standard"
        value={value}
        // @ts-ignore
        onChange={(e) => form.setValue(fieldName, e.target.value)}
      >
        <Mui.MenuItem value={""}>
          <em>Nepasirinkta</em>
        </Mui.MenuItem>
        {options.map((option) => (
          <Mui.MenuItem key={option.key} value={option.key}>
            {option.displayValue}
          </Mui.MenuItem>
        ))}
      </Mui.Select>
    </Mui.FormControl>
  );
};

export default Select;
