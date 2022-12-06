import { SelectOption } from "../types/props/selectOption.schema";

const convertByFields = <T>(values: Array<T> | undefined, keyField: keyof T, displayField: keyof T) : Array<SelectOption> => {
  if (!values) {
    return [];
  }
  
  const options = values.map(value => ({
    key: value[keyField] as string,
    displayValue: value[displayField] as string
  }));

  return options;
};

type convertProps<T> = {
  values: Array<T> | undefined;
  extractKey: (value: T) => string;
  extractDisplayValue: (value: T) => string;
}

const convert = <T>(props: convertProps<T>) => {
  const { values, extractKey, extractDisplayValue } = props;

  if (!values) {
    return [];
  }

  const options = values.map(value => ({
    key: extractKey(value),
    displayValue: extractDisplayValue(value)
  }));

  return options as SelectOption[];
};

const optionsService = {
  convert,
  convertByFields
};

export default optionsService;
