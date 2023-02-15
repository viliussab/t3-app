import React from "react";
import * as RHC from "react-hook-form";
import * as Mui from "@mui/material";
import {
  DesktopDatePicker,
  LocalizationProvider,
  DesktopDatePickerProps,
} from "@mui/x-date-pickers";
import AdapterDateFns from "@date-io/date-fns";

type DatePickerTemplateProps<T extends RHC.FieldValues> = {
  fieldName: RHC.Path<T>;
  form: RHC.UseFormReturn<T>;
  label: string;
  onChangeSuccess?: (value: Date) => void;
  datePickerProps?: Omit<
    DesktopDatePickerProps<Date, Date>,
    "value" | "onChange" | "renderInput"
  >;
  textFieldProps?: Mui.TextFieldProps;
};

const DatePickerTemplate = <T extends RHC.FieldValues>(
  props: DatePickerTemplateProps<T>
) => {
  const {
    form,
    label,
    fieldName,
    onChangeSuccess,
    datePickerProps,
    textFieldProps,
  } = props;

  const currentValue = form.watch(fieldName);

  const onChange = (value: Date | null) => {
    if (!value) {
      return;
    }

    // @ts-ignore
    form.setValue(fieldName, value);

    if (onChangeSuccess) {
      onChangeSuccess(value);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        {...datePickerProps}
        value={currentValue}
        label={label}
        onChange={onChange}
        renderInput={(props: Mui.TextFieldProps) => {
          return (
            <Mui.TextField
              {...props}
              {...textFieldProps}
              variant="filled"
              required
              fullWidth
              InputLabelProps={{ shrink: !!currentValue }}
            />
          );
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerTemplate;
