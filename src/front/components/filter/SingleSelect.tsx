import { SelectOption } from "../../../types/common.schema";
import * as Mui from "@mui/material";

type SelectProps = {
    onChange: (option: SelectOption) => void,
    label: string,
    options: SelectOption[],
    muiProps?: Mui.TextFieldProps | undefined,
}

const SingleSelectFilter = (props: SelectProps) => {
  const {label, options} = props;

  return (
    <Mui.FormControl variant="filled" fullWidth>
      <Mui.InputLabel id="select-standard-label">{label}</Mui.InputLabel>
      <Mui.Select
        fullWidth
        required
        defaultValue=""
        labelId="select-standard-label"
        id="select-standard"
        onChange={(event) => props.onChange({key: event.target.value, displayValue: event.target.name})}
      >
        <Mui.MenuItem value={""}>
          <em>Nepasirinkta</em>
        </Mui.MenuItem>
        {options.map((option) => 
          <Mui.MenuItem key={option.key} value={option.key}>{option.displayValue}</Mui.MenuItem>
        )}
      </Mui.Select>
    </Mui.FormControl>
  );
};

export default SingleSelectFilter;
