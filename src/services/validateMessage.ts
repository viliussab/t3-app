
const num = {
  gte: (name: string, gteValue: number) => {
    return `${name} turi būti daugiau nei '${gteValue}'`;
  },
  lte: (name: string, lteValue: number) => {
    return `${name} turi būti mažiau nei '${lteValue}'`;
  }
};

const numParams = (name : string) => ({
  required_error: `${name} yra privalomas`,
  invalid_type_error: `${name} turi būt skaičius`
});

const validateMessageService = {
  num,
  numParams
};

export default validateMessageService;
