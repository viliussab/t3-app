import React from "react";
import * as RHC from "react-hook-form";
import * as Mui from "@mui/material";

type FieldProps<T extends RHC.FieldValues> = {
    fieldName: RHC.Path<T>,
    form: RHC.UseFormReturn<T>,
    label: string,
    muiProps: Mui.TextFieldProps | undefined,
    valueAsNumber?: boolean,
}

const Field = <T extends RHC.FieldValues, > (props: FieldProps<T>) => {
  const {fieldName, form, label, muiProps, valueAsNumber} = props; 
  const error = form.formState.errors[fieldName];

  return (
    <Mui.TextField
      label={label}
      fullWidth
      variant="filled"
      error={!!error}
      helperText={error ? error.message?.toString() : ""}
      {...form.register(fieldName, {
        valueAsNumber
      })}
      {...muiProps}
    />
  );
};

export default Field;
