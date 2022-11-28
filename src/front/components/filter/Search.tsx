import React from "react";
import * as Mui from "@mui/material";

const REFRESH_TIME_MS = 1000;

type SearchFilterProps = {
    label: string,
    value: string,
    onChange: (value: string) => void,
    muiProps?: Mui.TextFieldProps | undefined,
}

export default function SearchFilter(props : SearchFilterProps) {
  const {
    label,
    value,
    onChange,
    muiProps
  } = props;
  
  const [searchTerm, setSearchTerm] = React.useState<string>(value);
  
  React.useEffect(() => setSearchTerm(value), [value]);
  
  React.useEffect(() => {
    const delayChange = setTimeout(() => {
      if (value === searchTerm) {
        return;
      }
  
      onChange(searchTerm);
    }, REFRESH_TIME_MS);
  
    return () => clearTimeout(delayChange);
  }, [onChange, searchTerm, value]);
  
  return (
    <Mui.TextField
      label={label}
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
      {...muiProps}
    />
  );
}
