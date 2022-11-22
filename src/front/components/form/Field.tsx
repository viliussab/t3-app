import React from "react";
import * as RHC from "react-hook-form";
import * as Mui from "@mui/material";

type FieldProps<T extends RHC.FieldValues> = {
    fieldName: RHC.Path<T>,
    form: RHC.UseFormReturn<T>,
    label: string,
    muiProps: Mui.TextFieldProps | undefined,
}

const Field = <T extends RHC.FieldValues, > (props: FieldProps<T>) => {
  const {fieldName, form, label, muiProps} = props; 
  const error = form.formState.errors[fieldName];

  return (
    <Mui.TextField
      label={label}
      fullWidth
      required
      variant="filled"
      error={!!error}
      helperText={error ? error.message?.toString() : ""}
      {...form.register(fieldName)}
      {...muiProps}
    />
  );
};

export default Field;
