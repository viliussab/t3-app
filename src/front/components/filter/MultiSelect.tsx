import { SelectOption } from "../../../types/common.schema";
import * as Mui from "@mui/material";

type SelectProps = {
    onChange: (values: string[]) => void,
    selectedKeys: string[],
    label: string,
    options: SelectOption[],
    muiProps?: Mui.TextFieldProps | undefined,
}


const MultiSelectFilter = (props: SelectProps) => {
  const {label, options, selectedKeys} = props;

  const handleChange = (event : Mui.SelectChangeEvent<string[]>) => {
    const { value } = event.target;

    typeof value === "string" ? props.onChange([value]) : props.onChange(value);
  };

  return (
    <Mui.FormControl variant="outlined" fullWidth>
      <Mui.InputLabel id={`select-standard-label-${label}`}>{label}</Mui.InputLabel>
      <Mui.Select<string[]>
        fullWidth
        multiple
        value={selectedKeys}
        required
        renderValue={(selected) => selected.join(", ")}
        input={<Mui.OutlinedInput label={label} />}
        labelId={`select-standard-label-${label}`}
        id="select-standard"
        onChange={handleChange}
      >
        {options?.map((option) => 
          <Mui.MenuItem key={option.key} value={option.key}>
            <Mui.Checkbox checked={selectedKeys.some(key => key === option.key) === true} />
            <Mui.ListItemText primary={option.displayValue} />
          </Mui.MenuItem>
        )}
      </Mui.Select>
    </Mui.FormControl>
  );
};

export default MultiSelectFilter;
