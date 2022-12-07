import { SelectOption } from "../../../types/props/selectOption.schema";
import * as Mui from "@mui/material";

type SelectProps = {
    onChange: (option: SelectOption) => void,
    value: string,
    label: string,
    options: SelectOption[],
    muiProps?: Mui.TextFieldProps | undefined,
}

const SingleSelectFilter = (props: SelectProps) => {
  const {label, options, value} = props;

  return (
    <Mui.FormControl variant="outlined" fullWidth>
      <Mui.InputLabel id={`select-standard-label-${label}`}>{label}</Mui.InputLabel>
      <Mui.Select
        fullWidth
        value={value}
        required
        defaultValue=""
        input={<Mui.OutlinedInput label={label} />}
        labelId={`select-standard-label-${label}`}
        id="select-standard"
        onChange={(event) => props.onChange({key: event.target.value, displayValue: event.target.name})}
      >
        {options?.map((option) => 
          <Mui.MenuItem key={option.key} value={option.key}>{option.displayValue}</Mui.MenuItem>
        )}
      </Mui.Select>
    </Mui.FormControl>
  );
};

export default SingleSelectFilter;
