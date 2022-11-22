import { SelectOption } from "../types/common.schema";

const convert = <T>(values: Array<T> | undefined, keyField: keyof T, displayField: keyof T) : Array<SelectOption> => {
  if (!values) {
    return [];
  }
  
  const options = values.map(value => ({
    key: value[keyField] as string,
    displayValue: value[displayField] as string
  }));

  return options;
};

const optionsService = {
  convert
};

export default optionsService;
