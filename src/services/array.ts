const isUnique = <T>(value: T, index: number, self: T[]) => {
  return self.indexOf(value) === index;
};

const arrayService = {
  isUnique,
};

export default arrayService;
