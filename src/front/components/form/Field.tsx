import React from "react";
import * as RHC from "react-hook-form";
import * as Mui from "@mui/material";
import { register } from "ts-node";

type FieldProps<T extends RHC.FieldValues> = {
  fieldName: RHC.Path<T>;
  form: RHC.UseFormReturn<T>;
  label: string;
  muiProps: Mui.TextFieldProps | undefined;
};

const Field = <T extends RHC.FieldValues>(props: FieldProps<T>) => {
  const { fieldName, form, label, muiProps } = props;
  const error = form.formState.errors[fieldName];

  return (
    <Mui.TextField
      label={label}
      fullWidth
      variant="filled"
      error={!!error}
      helperText={error ? error.message?.toString() : ""}
      InputLabelProps={{
        shrink: !!form.watch(fieldName),
      }}
      {...form.register(fieldName)}
      {...muiProps}
    />
  );
};

export default Field;
